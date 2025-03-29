<template>
    <ParticipantDemographics v-if="adjustedQuestionIdx === -1" :study=study />
    <ParticipantQuestions v-else :questions="questions" :questionIndex="adjustedQuestionIdx" />

    <div class="participant__navigation">
        <button @click="prevQuestion" v-if="questionIndex !== 0" class="participant__button participant__button--back font-small font-semi">Back</button>
        <!-- show 'send' button if question index is at the last step -->
        <button @click="sendForm"  v-if="questionIndex === totalSteps - 1" class="participant__button participant__button--send font-small font-semi">Send</button>
        <button @click="nextQuestion" v-else class="participant__button participant__button--next font-small font-semi">Next</button>
    </div>
</template>

<script setup>
// need to emit progress so progress bar know which question you're at, and to calculate the percentage of each step
const emit = defineEmits(['updateProgress', 'totalSteps']);

const props = defineProps({
    study: Object
});

// store the questions array
const questions = computed(() => props.study?.questions || []);

// track the index, starting at 0
const questionIndex = ref(0);

// total steps of study, that included demographics (if required) + total questions
const totalSteps = computed(() => {
    // add one extra step if `demographicReq` is true
    const demographicsStep = props.study?.demographicReq ? 1 : 0;
    const allSteps = (questions.value?.length || 0) + demographicsStep;
    emit('totalSteps', allSteps);
    return allSteps;
});

// have to adjust the question indexing based on `demographicReq` (starts on -1 if it's true)
const adjustedQuestionIdx = computed(() => {
    return props.study?.demographicReq ? questionIndex.value - 1 : questionIndex.value;
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

// TODO: send form if required fields are filled etc.
const sendForm = () => {
    console.log("Should check if required fields are filled out, and seeeend.")
}

</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
