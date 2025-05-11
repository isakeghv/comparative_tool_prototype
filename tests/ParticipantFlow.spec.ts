import { mount, flushPromises, config } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ParticipantMain from '../components/participant/participant-main.vue';
import ParticipantIntro from '../components/participant/participant-intro.vue';
import ParticipantDemographics from '../components/participant/participant-demographics.vue';
import ParticipantQuestions from '../components/participant/participant-questions.vue';
import { nextTick } from 'vue';

vi.mock('../services/participantService.js', () => ({
  default: {
    updateParticipant: vi.fn(() =>
      Promise.resolve({ updated: true, result: { dummy: 'data' } })
    ),
  },
}));

config.global.components = {
  ParticipantDemographics,
  ParticipantQuestions,
}

const baseStudy = {
  title: 'Test Study',
  description: 'This is a test study description',
  demographicReq: true,
  demographic: [
    { id: 0, question: 'Request age', responseType: 'number', request: true, required: true },
    { id: 1, question: 'Request gender', responseType: 'radio', request: true, required: false },
  ],
  customTerms: { request: true, terms: 'Test terms' },
  questions: [
    { id: 'q1', question: 'Pick one artifact', type: 'radio', artifacts: [{ id: 'a1', source: 'image.png' }] },
  ]
};

describe('Participant Flow Integration Suite', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(ParticipantMain, {
      props: { study: baseStudy },
      global: {
        stubs: ['ArtifactMedia', 'ArtifactExpandButton', 'ArtifactPreview', 'ArtifactDropLinear', 'ArtifactDisplay'],
      },
    });
  });

  // POSITIVE CASES
  it('Positive: completes entire participant flow successfully', async () => {
    expect(wrapper.findComponent(ParticipantDemographics).exists()).toBe(true);

    // Simulate demographic answer input
    wrapper.vm.nextQuestion();
    await nextTick();

    expect(wrapper.findComponent(ParticipantQuestions).exists()).toBe(true);

    // Move to question, then to send
    wrapper.vm.nextQuestion();
    await flushPromises();

    wrapper.vm.sendForm();
    await flushPromises();

    expect(wrapper.text()).toContain('Thank you for completing the study.');
  });

  // BOUNDARY CASES 
  it('Boundary: last question triggers "Send" button', async () => {
    wrapper.vm.nextQuestion(); // To questions
    await nextTick();
    wrapper.vm.nextQuestion(); // To final step
    await nextTick();

    const sendButton = wrapper.find('button.participant__button--send');
    expect(sendButton.exists()).toBe(true);
    sendButton.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Thank you for completing the study.');
  });

  it('Boundary: terms checkbox disables start', async () => {
    const introWrapper = mount(ParticipantIntro, {
      props: {
        study: baseStudy,
        handleStart: vi.fn(),
      },
    });

    const startButton = introWrapper.find('button');
    expect(startButton.element.disabled).toBe(true);

    await introWrapper.find('input[type="checkbox"]').setValue(true);
    expect(startButton.element.disabled).toBe(false);
  });

  // EDGE CASES
  it('Edge: no demographics requested skips demographics step', async () => {
    const studyNoDemographics = { ...baseStudy, demographicReq: false };
    const noDemoWrapper = mount(ParticipantMain, {
      props: { study: studyNoDemographics },
    });

    expect(noDemoWrapper.findComponent(ParticipantDemographics).exists()).toBe(false);
  });

  it('Edge: questionIndex overflow does not crash', async () => {
    wrapper.vm.questionIndex = 99;
    await nextTick();

    expect(wrapper.findComponent(ParticipantQuestions).exists()).toBe(false);
  });

  // NEGATIVE CASES
  it('Negative: submit without answering required demographics still works (graceful fail)', async () => {
    // Simulate jumping to end without answering anything
    wrapper.vm.questionIndex = wrapper.vm.totalSteps - 1;
    await nextTick();

    await wrapper.vm.sendForm();
    await flushPromises();

    expect(wrapper.text()).toContain('Thank you for completing the study.');
  });

  it('Negative: malformed response structure handled safely', async () => {
    wrapper.vm.participantAnswer.demographic = 'not-an-array';
    await expect(wrapper.vm.sendForm()).resolves.not.toThrow();
  });
});
