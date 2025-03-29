<template>
    <ParticipantDemographics v-if="adjustedQuestionIdx === -1" :study=study />
    <ParticipantQuestions v-else :questions="questions" :questionIndex="adjustedQuestionIdx" />

    <div class="participant__navigation">
        <button @click="prevQuestion" :disabled="questionIndex === 0" class="nav__back">Back</button>
        <button @click="nextQuestion" class="nav__next">Next</button>
    </div>
</template>

<script setup>
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
    return (questions.value?.length || 0) + demographicsStep;
});

// have to adjust the question indexing based on `demographicReq` (starts on -1 if it's true)
const adjustedQuestionIdx = computed(() => {
    return props.study?.demographicReq ? questionIndex.value - 1 : questionIndex.value;
});

// if current question index is not larger than the index of the last question, increment to "move forward"
const nextQuestion = () => {
    if (questionIndex.value < totalSteps.value - 1) {
        questionIndex.value++;
    }
};

const prevQuestion = () => {
    if (questionIndex.value > 0) {
        questionIndex.value--;
    }
};

</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
