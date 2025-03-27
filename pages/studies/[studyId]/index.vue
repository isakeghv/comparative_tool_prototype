<template>
    <ParticipantHeader :start="start" @start="handleStart"/>
    <main class="participant__cont">
        <ParticipantIntro
            v-if="study && showIntro"
            :study="study" 
            :handleStart="handleStart" 
        />

        <div v-else>
            <p>{{ message }}</p>
        </div>

        <ParticipantMain v-if="study && start" :study="study" />
    </main>
</template>

<script setup>
import { validate as isValidUUID } from 'uuid';
import StudyService from '~/services/studyService';

const studyId = ref(null);
const study = ref(null);
const isValidId = ref(true);
const message = ref('');
// const questions = ref([]);
// const questionIndex = ref(0);

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
        return;
    };
    
    // fetch study if the format is correct, but make sure to only proceed if the status is ongoing
    try {
        const response = await StudyService.fetchStudy(studyId);

        if (!response || !response.study) {
            message.value = "The study could not be found.";
            return;
        }

        if (!response) return;
            
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
// TODO: should propbably move the 'ongoing' check to the template
const showIntro = computed(() => study.value.status === 'ongoing' && currentView.value === 'intro');
const showDemographics = computed(() => study.value.demographicReq && study.value.status === 'ongoing' && currentView.value === 'demographics');
const showQuestions = computed(() => study.value.status === 'ongoing' && currentView.value === 'questions');

// when clicked on start, create a participant session
const handleStart = () => {
    start.value = true;

    // show questions after clicking on start (this needs a bit more thinking... design-wise)
    currentView.value = "questions";
    // console.log(questions.value);
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