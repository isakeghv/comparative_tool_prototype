<template>
    <ParticipantHeader :start="start" @start="handleStart"/>
    <main>
        <div v-if="studyStatus === 'ongoing'">
            SHOW THIS COOL PAGE
        </div>
        <div v-else>
            <p>{{ message }}</p>
        </div>
    </main>
</template>
<script setup>
import { validate as isValidUUID } from 'uuid';
import StudyService from '~/server/services/studyService';

const studyId = ref(null);
const isValidId = ref(true);
const message = ref('');
const studyStatus = ref('');

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
        const study = response.study;

        switch (study.status) {
            case 'draft':
                message.value = "The study hasn't been published yet.";
                studyStatus.value = 'draft';
                break;
            case 'closed':
                message.value = "The study is closed.";
                studyStatus.value = 'closed';
                break;
            case 'ongoing':
                message.value = "The study is currently ongoing.";
                studyStatus.value = 'ongoing';
                break;
            default:
                message.value = "The study hasn't been published yet.";
                studyStatus.value = '';
        }

    } catch (error) {
        console.error(error);
        return 'There was an error fetching the study data. Please try again.';
    }
    
}

// when clicked on start, create a participant session
function handleStart() {
    start.value = true;
}

// watch for changes in the route param; set the study id ref to the one in the URL
watch(() => useRoute().params.studyId, async (newStudyId) => {
    studyId.value = newStudyId;
    await loadStudy(newStudyId);
}, { immediate: true });
</script>