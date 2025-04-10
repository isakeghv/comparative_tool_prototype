<template>
    <main v-if="!isSent" class="participant__cont">
        <ParticipantDemographics v-if="showDemographics && adjustedQuestionIdx === -1" :study=study />
        <ParticipantQuestions  v-else-if="adjustedQuestionIdx >= 0 && adjustedQuestionIdx < questions.length" :questions="questions" :questionIndex="adjustedQuestionIdx" />

        <div class="participant__navigation">
            <button @click="prevQuestion" v-if="questionIndex !== 0" class="participant__button participant__button--back font-small font-semi">Back</button>
            <!-- show 'send' button if question index is at the last step -->
            <button @click="sendForm"  v-if="questionIndex === totalSteps - 1" class="participant__button participant__button--send font-small font-semi">Send</button>
            <button @click="nextQuestion" v-else class="participant__button participant__button--next font-small font-semi">Next</button>
        </div>
    </main>
    <main v-else class="participant__cont">
        <!-- <h1 class="font-h5 font-semi">Thank you for filling the study.</h1> -->
        <p>Thank you for completing the study! Your participation is greatly appreciated, and your input will help us move forward with our research.</p>
    </main>
</template>

<script setup>
// need to emit progress so progress bar know which question you're at, and to calculate the percentage of each step
const emit = defineEmits(['updateProgress', 'totalSteps', 'participantDone']);
import ParticipantService from '~/services/participantService';
import { participantId, participantAnswer } from '~/public/script/participant';

const props = defineProps({
    study: Object
});

const isSent = ref(false);

// store the questions array
const questions = computed(() => props.study?.questions || []);

// track the index, starting at 0
const questionIndex = ref(0);

// show demographics if at minimum one question is requested
const showDemographics = computed(() => {
    return props.study.demographic.some(question => question.request === true);
});

// total steps of study, that included demographics (if required) + total questions
const totalSteps = computed(() => {
    // add one extra step if `demographicReq` is true
    const demographicsStep = (showDemographics.value && props.study?.demographicReq) ? 1 : 0;
    const allSteps = (questions.value?.length || 0) + demographicsStep;
    emit('totalSteps', allSteps);
    return allSteps;
});

// have to adjust the question indexing based on `demographicReq` (starts on -1 if it's true)
const adjustedQuestionIdx = computed(() => {
    console.log(showDemographics);
    return (showDemographics.value && props.study?.demographicReq) ? questionIndex.value - 1 : questionIndex.value;
});

// if current question index is not larger than the index of the last question, increment to "move forward"
const nextQuestion = () => {
    if (questionIndex.value < totalSteps.value - 1) {
        questionIndex.value++;
        emit('updateProgress', questionIndex.value);
    }
};

const prevQuestion = () => {
    if (questionIndex.value > 0) {
        questionIndex.value--;
        emit('updateProgress', questionIndex.value);
    }
};

/* Participant-radio-checkbox
const sendForm = async () => {
  try {
    // Structure
    const participantResponse = {
      answers: {},
      demographic: participantAnswer.demographic || {}
    }

*/

// TODO: send form if required fields are filled etc.
const sendForm = async () => {
    //turning into array, so response can be iterated; map so it fits structure of schema
    const questions = Object.entries(participantAnswer)
    .filter(([id]) => id !== 'demographic')
    .map(([id, answers]) => {
        // need to unwrap it from the reactive array (originally stored as an proxy object)
        const rawAnswers = toRaw(answers);

        return {
            id,
            answer: Object.values(rawAnswers)
        };
    });

    console.log(Object.entries(participantAnswer));

    //creating response-object
    const participantResponse = {};

    //making sure that it has "questions"
    if (!participantResponse.questions) participantResponse.questions = [];


/*
    for (const [key, value] of Object.entries(participantAnswer)) {
      if (key !== 'demographic') {
        participantResponse.answers[key] = value
      }
    }

    await $fetch('/api/participants', {
      method: 'POST',
      body: {
        studyId: props.study.id,
        answers: participantResponse.answers,
        demographic: participantResponse.demographic
      }
    })

    console.log('Submitted')
  } catch (err) {
    console.error('Error submitting response:', err)
    alert('Something went wrong while submitting your answers.')
  }

*/

//iterating array created earlier. Used to make sure response is given in the correct format
    questions.forEach(question =>{
        //only inserting if it is not demographics
        if (question.key !== 'demographic') participantResponse.questions[question.id] = question.value
    })

    const questionsObject = { questions: questions }

    // send participant study and update participant ->  should status to 'completed brb
    const updateSession = await ParticipantService.updateParticipant(participantId.id, questionsObject);

    // if successful, switch to completion study page
    console.log(updateSession.updated);

    if (updateSession.updated) {
        isSent.value = true;
        emit('participantDone');
    }
}
</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
