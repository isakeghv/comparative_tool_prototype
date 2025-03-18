<template>
	<DashboardHeader :name="displayName" :isCreatingStudy="isCreatingStudy"/>
	<div class="container" v-if="showMain && !study.id">
		<DashboardMain
            @newStudy="(id) => onNewStudy(id)" 
            @selectStudy="(study) => onEditStudy(study)"
            @editStudy="(study) => onEditStudy(study)"
        />
	</div>
    <!-- show study editor if id has been passed in, and show as read only/disabled if opened with select (read operation) -->
    <StudyEditor v-if="study.id" :disabled="isReadOnly"/>

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
import { setStudyData } from '~/server/utils/studyUtils';

const showMain = ref(true);
const displayName = ref('');
const isReadOnly = ref();

// need to track if study already exists or should be updated due to the saving logic
const isCreatingStudy = ref(false);

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

    // load the study with the data of selected study if it exists, and update flag to avoid creating a new studying when saving
    if (selectedStudy) {
        setStudyData(study, initialStudy, selectedStudy);
        // isStudyCreated.value = true;
    }
}

const onNewStudy = (id) => {
    study.id = id;
    isReadOnly.value = false;
    isCreatingStudy.value = true;
}

// open in read only mode, where all fields are disabled
// const onSelectStudy = (study) => {
//     populateStudy(study);
//     isReadOnly.value = true;
//     isCreatingStudy.value = false;
// }

const onEditStudy = (study) => {
    populateStudy(study);
    isReadOnly.value = false;
    isCreatingStudy.value = false;
}

</script>

<style scoped>
@import url('public/style/pages/dashboard/dashboard.scss');
</style>