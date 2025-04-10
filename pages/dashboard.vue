<template>
	<DashboardHeader :name="displayName" :isCreatingStudy="isCreatingStudy" @unableSave="(reason) => displayUnableSaveBox(true, reason)" :disabled="isReadOnly" />
	<div class="container" v-if="showMain && !study.id">
		<DashboardMain
            @newStudy="(id) => onNewStudy(id)" 
            @selectStudy="(id) => onEditStudy(id)"
            @editStudy="(id) => onEditStudy(id)"
            @deleteStudy="(id) => onDeleteStudy(id)"
        />
	</div>
    <!-- show study editor if id has been passed in, and show as read only/disabled if opened with select (read operation) -->
    <StudyEditor v-if="study.id" :disabled="isReadOnly" />

    <!--Prompt box informing user that study cannot be saved due to missing fields-->
    <DashboardUnableSave @exit="displayUnableSaveBox(false)" v-if="showUnableSaveBox && study.id" :reason="unableSaveReason" />

	<!--Display message if issues fetting user-info-->
	<div class="container" v-if="!showMain && !study.id">
		<h2 class="container__headline">Oh oh!</h2>
		<p class="container__paragraph">Issues retrieving information. Please try to reload</p>
        <button class="container__button">Reload</button>
        <span class="container__span">or</span>
        <button class="container__button">sign out</button>
	</div>
</template>

<script setup>
import { user, study, initialStudy } from '~/public/script/reactive';
import StudyService from '~/services/studyService';

const showMain = ref(true);
const displayName = ref('');
const isReadOnly = ref(false);
const status = ref('');

// reason why it wasn't possible to save
const unableSaveReason = ref('');

// need to track if study already exists or should be updated due to the saving logic
const isCreatingStudy = ref(false);
const showUnableSaveBox = ref(false);

//toggles the prompt-box providing user message that study cannot be saved, and a reason (if included)
const displayUnableSaveBox = (display, reason = '') => {
    showUnableSaveBox.value = display;
    unableSaveReason.value = reason;
}

// provide the 'disabled' state to all child components as some of them are deeply nested instead of sending it as a prop to avoid prop drilling
provide('disabled', isReadOnly);

const getUserInfo = async () => {
	try {
        //getting the user-information; include any cookies included in the request
        const { data, error } = await useFetch("/api/users", { credentials: "include" });

        if (error.value) {
            throw new Error(error.value);
        }

        //confirming that data was fetched
        if (data.value) {
            //inserting user-info into reactive variable
            user.info = data.value.userProfileData;

            //inserting studies into reactive variable (client-side only)
            user.studies = data.value.studies;

            //setting name to display into variable, to be passed to header-component
            displayName.value = user.info.firstName;
        } else {
            //setting to false in case information was not fetched, to display error message to user in UI
            showMain.value = false;
        }
    } catch (err) {
        console.error('Error fetching user info:', err);
        showMain.value = false;
    }
}

await getUserInfo();

const populateStudy = (id) => {
    // find study with matching id that is stored when user loads dashboard
    const selectedStudy = user.studies.find(study => study.id === id);

    // set current status of study
    status.value = selectedStudy.status;

    // load the study with the data of selected study if it exists
    if (selectedStudy) {
        // study.id = selectedStudy.id;
        // study.title = selectedStudy.title;
        // study.description = selectedStudy.description;
        // study.demographicReq = selectedStudy.demographicReq;
        // study.demographic = selectedStudy.demographic;
        // study.customTerms = selectedStudy.customTerms;
        // study.questions = selectedStudy.questions;
        // study.desiredResponses = selectedStudy.desiredResponses;
        // study.closingMethod = selectedStudy.closingMethod;
        // study.closingLimit = selectedStudy.closingLimit;

        // // use deep copy to avoid sharing references
        // initialStudy.title = JSON.parse(JSON.stringify(selectedStudy.title));
        // initialStudy.description = JSON.parse(JSON.stringify(selectedStudy.description));
        // initialStudy.demographicReq = JSON.parse(JSON.stringify(selectedStudy.demographicReq));
        // initialStudy.demographic = JSON.parse(JSON.stringify(selectedStudy.demographic));
        // initialStudy.customTerms = JSON.parse(JSON.stringify(selectedStudy.customTerms));
        // initialStudy.questions = JSON.parse(JSON.stringify(selectedStudy.questions));
        // initialStudy.desiredResponses = JSON.parse(JSON.stringify(selectedStudy.desiredResponses));
        // initialStudy.closingMethod = JSON.parse(JSON.stringify(selectedStudy.closingMethod));
        // initialStudy.closingLimit = JSON.parse(JSON.stringify(selectedStudy.closingLimit));

        study.id = selectedStudy.id;

        // // use deep copy to avoid sharing references
        const studyClone = JSON.parse(JSON.stringify(selectedStudy));
        const initialStudyClone = JSON.parse(JSON.stringify(selectedStudy));
        
        Object.assign(study, studyClone);
        Object.assign(initialStudy, initialStudyClone);
    }
}

const onNewStudy = (id) => {
    study.id = id;
    isReadOnly.value = false;
    isCreatingStudy.value = true;
}

const onEditStudy = (id) => {
    populateStudy(id);

    // set 'isReadOnly' to false if current study is true
    isReadOnly.value = status.value !== 'draft';
    isCreatingStudy.value = false;
}

const onDeleteStudy = (id) => {
    StudyService.deleteStudy(id);
    // find index of the study in the array
    const studyIndex = user.studies.findIndex(study => study.id === id);

    // if the index was found, remove the study from the array
    if (studyIndex !== -1) {
        user.studies.splice(studyIndex, 1);
    }
}

</script>

<style scoped>
    @import url('public/style/pages/dashboard/dashboard.scss');
</style>