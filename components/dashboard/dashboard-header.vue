<template>
    <header class="header">
        <h1 class="header__headline font-heavy font-h3">Compara</h1>
        <p class="header__paragraph font-h6" v-if="name && !study.id">
            Welcome, <span class="header__span font-h6 font-heavy">{{ name }}</span>!
        </p>
        <div class="header__container" v-if="study.id">
            <div class="header__buttons">
                <button v-if="!isDisabled" class="header__button" data-tooltip="Save" @click="saveStudy()">
                    <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                        <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Z"/>
                    </svg>
                </button>
                <button class="header__button" data-tooltip="Preview">
                    <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
                    </svg>
                </button>
                <DashboardUndoRedo v-if="!isDisabled" />
                <button class="header__button" data-tooltip="Link">
                    <svg class="header__icon" viewBox="0 -960 960 960" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path xmlns="http://www.w3.org/2000/svg" d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z"/>
                    </svg>
                </button>
            </div>
            <button class="header__publish font-semi font-normal" @click="publishStudy" :disabled="wasStudyCreated.value">Publish</button>
        </div>
        <slot></slot>
    </header>
</template>

<script setup>
//importing reactive variable which holds the id of the study and where the study questions are stored
import StudyService from '~/services/studyService';
import { user, study, initialStudy, wasStudyCreated } from '~/public/script/reactive';
import { compareStudies } from '~/utils/studyUtils';

const isDisabled = inject('disabled'); 

const props = defineProps({
    name: String,
    id: String,
    isCreatingStudy: Boolean
})

console.log(props.isCreatingStudy);

//event to emit in case the study was unable to save
const emit = defineEmits(['unableSave'])

//saves it to "study.initial": 
// - The "back" button prevents user from going back if the initial study-configuration is not
//      similar to the current. Saving updates so the "initial" has the current setup, so the user can go back
const updateSaveHistory = () => {
    // create an array of the study properties to loop through more efficiently
    const properties = [
        'questions',
        'demographicReq',
        'demographic',
        'description',
        'title',
        'customTerms',
        'desiredResponses',
        'closingLimit',
        'closingMethod'
    ];

    properties.forEach(property => {
        initialStudy[property] = JSON.parse(JSON.stringify(study[property]));
    });
};

// when clicking on 'save', update the tracking of changes and create new study if it hasn't been created yet
const saveStudy = async () => {
    // compare the two study states to see if there has been no changes
    const noChanges = compareStudies(study, initialStudy);
    console.log(noChanges);

    //returning if no changes have been made
    if (noChanges) return;

    // if study gets created, update the flag to true; 'isCreatingStudy' prop sent from 'Dashboard' component also has to be true
    if (!wasStudyCreated.value && props.isCreatingStudy) {

        // pass in the data from the `study` reactive variable and the user id as a ref
        const newStudy = await StudyService.createStudy(study, user.info._id);
        console.log(newStudy);

        if (newStudy && newStudy.study) {
            user.studies.push(JSON.parse(JSON.stringify(newStudy.study)));
            wasStudyCreated.value = true;

            // first update the tracking of the initial and current study
            updateSaveHistory();

        } else emit('unableSave');
        

        return;
    } else if (!noChanges) {
        // if changes have happened, send a PUT request with the study data as the body
        const updatedStudy = await StudyService.updateStudy(study.id, study);

        if (updatedStudy) {
            // find index of the study that is currently in progress and display correct information if changes have happened to UI w/o reloading
            const studyIndex = user.studies.findIndex(study => study.id === updatedStudy.study.id);

            // first update the tracking of the initial and current study
            updateSaveHistory();

            // if updatedStudy id is found within user.studies
            if (studyIndex !== -1) {
                user.studies[studyIndex] = JSON.parse(JSON.stringify(updatedStudy.study));
            }
        } else emit('unableSave');

        return;
    } else emit('unableSave');
};

const publishStudy = async () => {
    // return if it hasn't been saved yet -> should probably show a prompt box of sorts
    const noChanges = compareStudies(study, initialStudy);

    // if there is changes and it hasn't been created yet, show a prompt box telling them to save, else publish the study
    // TODO: add more checks here omg
    console.log(noChanges);
    if (!noChanges) {
        emit('unableSave', {reason: 'save'});
        return;
    }

    const studyIndex = user.studies.findIndex(userStudy => userStudy.id === study.id);

    // don't update if status is already 'ongoing'
    if (user.studies[studyIndex].status === 'ongoing') return;

    const updatedStudy = await StudyService.publishStudy(study.id);

    // update status to pushish, and set disabled to true
    if (updatedStudy) {
        user.studies[studyIndex].status = 'ongoing';
        isDisabled.value = true;
    }
}
</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-header.scss');
</style>