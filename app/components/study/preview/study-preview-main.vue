<template>
    <main class="participant__cont">
        <StudyPreviewDemographics v-if="showDemographics && adjustedQuestionIdx === -1" :study=study />
        <StudyPreviewQuestions  v-else-if="adjustedQuestionIdx >= 0 && adjustedQuestionIdx < questions.length" :questions="questions" :questionIndex="adjustedQuestionIdx" />

        <div class="participant__navigation">
            <button @click="prevQuestion" v-if="questionIndex !== 0" class="participant__button participant__button--back font-small font-semi" id="participant-back-btn">Back</button>
            <!-- show 'send' button if question index is at the last step -->
            <button @click="closeForm"  v-if="questionIndex === totalSteps - 1" class="participant__button participant__button--send font-small font-semi" id="participant-send-btn">Close</button>
            <button @click="nextQuestion"
                v-else
                class="participant__button participant__button--next
                font-small font-semi"
                id="participant-next-btn"
            >
                Next
            </button>
            <!-- <button @click="prevQuestion" v-if="questionIndex !== 0" class="participant__button participant__button--back font-small font-semi">Back</button>
            <button @click="nextQuestion" v-else class="participant__button participant__button--next font-small font-semi">Next</button> -->
        </div>
    </main>
</template>

<script setup>
// need to emit progress so progress bar know which question you're at, and to calculate the percentage of each step
const emit = defineEmits(['updateProgress', 'totalSteps', 'closePreview']);
import StudyPreviewDemographics from './study-preview-demographics.vue';
import StudyPreviewQuestions from './study-preview-questions.vue';

const props = defineProps({
    study: Object
});

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

const closeForm = () => {
    emit('closePreview', true);
}
</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
