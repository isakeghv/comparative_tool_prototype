<template>
    <ParticipantHeader :start="start" @start="handleStart"/>
    <main class="participant__cont">

    <ParticipantIntro
        v-if="showIntro"
        :study="study" 
        :handleStart="handleStart" 
    />

    <div v-else>
        <p>{{ message }}</p>
    </div>

    <ParticipantQuestion
        v-if="showQuestions"
        :questionIndex="questionIndex"
        :questions="questions"
    />

    <div class="participant__navigation" v-if="showButtons">
        <button @click="prevQuestion" :disabled="questionIndex === 0" class="nav__back">Back</button>
        <button @click="nextQuestion" class="nav__next">Next</button>
    </div>
    </main>
</template>

<script setup>
import { validate as isValidUUID } from 'uuid';
import StudyService from '~/server/services/studyService';

const studyId = ref(null);
const study = ref(null);
const isValidId = ref(true);
const message = ref('');
const questions = ref([]);
const questionIndex = ref(0);

// show view depending on which page the user is on
const currentView = ref('intro');

// set to true when user clicks continue or sm
const start = ref(false);

// check if the studyId has the correct UUID format
const validateIdFormat = (studyId) => isValidId.value = isValidUUID(studyId);

// if the id is in the correct format, fetch the study and check if it is published (right permissions as well in the future)
const loadStudy = async (studyId) => {
    const correctIdFormat = validateIdFormat(studyId);

    // minimum requirement: don't fetch from database if the id isn't in the correct format
    if (!correctIdFormat) {
        message.value = "The information you're looking for seems to be missing. Please make sure you entered the correct URL."
        studyStatus.value = '';
        return;
    };
    
    // fetch study if the format is correct, but make sure to only proceed if the status is ongoing
    try {
        const response = await StudyService.fetchStudy(studyId);

        // store the fetched study in the local state for futher processing
        study.value = response.study;

        if (study.value.status === 'draft') {
            message.value = "The study hasn't been published yet.";
        } else if (study.value.status === 'closed') {
            message.value = "The study is closed.";
        } else if (study.value.status !== 'ongoing') {
            // just have a simple message to avoid saying too much information in case of an error
            message.value = "The study hasn't been published yet.";
        }

    } catch (error) {
        console.error(error);
        message.value = 'There was an error fetching the study data. Please try again.';
        return;
    }
}

// make sure to only show the page views if study is published etc.
const showIntro = computed(() => study.value && study.value.status === 'ongoing' && currentView.value === 'intro');
const showQuestions = computed(() => study.value && study.value.status === 'ongoing' && currentView.value === 'questions');
const showButtons = computed(() => study.value && study.value.status === 'ongoing' && currentView.value === 'questions');

// when clicked on start, create a participant session
const handleStart = () => {
    start.value = true;
    questions.value = study.value.questions;

    // show questions after clicking on start (this needs a bit more thinking... design-wise)
    currentView.value = "questions";
    // console.log(questions.value);
}

// if current question index is not larger than the index of the last question, increment to "move forward"
const nextQuestion = () => {
    const length = questions.value.length - 1;
    if (questionIndex.value < length) {
        questionIndex.value++;
    }

    console.log(questionIndex.value);
}

const prevQuestion = () => {
    if (questionIndex.value > 0) {
        questionIndex.value--;
    }

    console.log(questionIndex.value);
}

// watch for changes in the route param; set the study id ref to the one in the URL
watch(() => useRoute().params.studyId, async (newStudyId) => {
    studyId.value = newStudyId;
    await loadStudy(newStudyId);
}, { immediate: true });
</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>