<template>
    <header class="header">
        <h1 class="header__headline font-heavy font-h3">Compara</h1>
        <p class="header__paragraph font-h6" v-if="name && !study.id">
            Welcome, <span class="header__span font-h6 font-heavy">{{ name }}</span>!
        </p>
        <div class="header__container" v-if="study.id">
            <div class="header__buttons">
                <button v-if="!isDisabled" class="header__button" data-tooltip="Save" @click="saveStudy()" id="header-save-btn">
                    <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Z" />
                    </svg>
                </button>
                <button v-if="isDisabled" class="header__button" data-tooltip="Export">
                    <svg class="header__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                        <path
                            d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                    </svg>
                </button>
                <button class="header__button" data-tooltip="Preview" @click="showPreview = true">
                    <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
                    </svg>
                </button>
                <DashboardUndoRedo v-if="!isDisabled" />
                <DashboardLink :study="study" />
            </div>
            <button v-if="!isDisabled" class="header__btn header__btn--publish font-semi font-normal" id="header-publish-btn"
                @click="setStudyStatus('ongoing')" :disabled="isCreatingStudy && !isEditingStudy">Publish</button>
            <button v-if="study && (study.status === 'ongoing' || study.status === 'completed')"
                class="header__btn header__btn--publish header__btn--toggle font-semi font-normal"
                id="header-btn-responses"
                @click="showResponses = !showResponses">{{ showResponses ? 'Hide' : 'Show' }} responses
            </button>
            <button v-if="study && study.status === 'ongoing'"
                class="header__btn header__btn--close font-semi font-normal"
                @click="setStudyStatus('completed')">Close
            </button>
        </div>
        <slot></slot>
    </header>
</template>

<script setup>
//importing reactive variable which holds the id of the study and where the study questions are stored
import StudyService from '~/services/studyService';
import { user, study, configs, currentConfigIndex, allUploadedArtifacts, initialStudy, showResponses, showPreview, errorQuestions, errorMsgs } from '~/public/script/reactive';
import { compareStudies } from '~/utils/studyUtils';
import { validateStudy, validateDemographics, removeErr } from '@/utils/studyValidator';
import { updateStudyStatus } from '~/services/studyService';

const isDisabled = inject('disabled', ref(false));

const props = defineProps({
    name: String,
    id: String,
    isCreatingStudy: Boolean
})

//event to emit in case the study was unable to save
const emit = defineEmits(['unableSave', 'update:isCreatingStudy']);
// need to check if publish button should be disabled or not
const isEditingStudy = ref(localStorage.getItem('isEditingStudy') === 'true');

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

const trackCurrentArtifacts = () => {
    const currentUsedArtifacts = [];
    const unusedArtifact = []

    study.questions.forEach(q => {
        q.artifacts.forEach(a => {
            const isInArr = currentUsedArtifacts.some(b => JSON.stringify(b) === JSON.stringify(a));
            if (!isInArr) currentUsedArtifacts.push(a);
        });
    });
    allUploadedArtifacts.value.forEach(a => {
        const isUsed = currentUsedArtifacts.find(b => a.source === b.source);
        if (!isUsed) unusedArtifact.push(a.source);
    })

    return unusedArtifact;
}

//create logic here to delete from server
const deleteUploads = async (unused) => {

    if (unused && unused.length > 0) {
        const request = await fetch('/api/artifact-delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(unused)
        })

        if (!request.ok) return console.error('Unable to delete unused artifacts');
    }
}

const localStorageCleanup = () => {
    localStorage.removeItem('unsavedStudy');
    localStorage.removeItem('isEditingStudy');
}

// when clicking on 'save', update the tracking of changes and create new study if it hasn't been created yet
const saveStudy = async () => {
    // compare the two study states to see if there has been no changes
    const noChanges = compareStudies(study, initialStudy);
    console.log('has no changes happened?', noChanges);

    //So when "configs" is saved, used cannot undo/redo again: 
    // - because artifacts might get deleted when saving
    configs.value = []
    currentConfigIndex.value = 0;

    //this has to be above returning if "noChanges", because someone might upload, then remove an image.
    // - If returning before this runs, it wont delete from the server
    deleteUploads(trackCurrentArtifacts())
    
    // returning if no changes have been made
    if (noChanges) return;
    console.log('props.icCreatingStudy', props.isCreatingStudy);

    //checks if user already has a study with the selected id
    const studyAlreadyExists = user.studies.find(us => us.id === study.id)

    // if no title, retur error
    if (!study.title || !study.title.trim()) {
        errorMsgs.push('noTitle');
        return emit('unableSave', { reason: 'noTitle' });
    } else {
        removeErr(true, 'noTitle');
    }

    // check if any question is missing a title
    let hasErrors = false;

    for (const q of study.questions) {
        const title = q.question;
        if (!title || !title.trim()) {
            errorQuestions[q.id] = true;
            hasErrors = true;
        }
    }

    if (hasErrors) {
        return emit('unableSave', { reason: 'noQuestionTitle' });
    }

    try {
        if (props.isCreatingStudy && !studyAlreadyExists) {
            // pass in the data from the `study` reactive variable and the user id as a ref
            const newStudy = await StudyService.createStudy(study, user.info._id);

            console.log(newStudy);

            if (newStudy && newStudy.study) {
                localStorageCleanup();
                user.studies.push(JSON.parse(JSON.stringify(newStudy.study)));

                // toggle it off by emiting the updated boolean to parent
                emit('update:isCreatingStudy', false);

            // first update the tracking of the initial and current study
            updateSaveHistory();

        } else emit('unableSave');

        return;
    } else if (!noChanges) {
        // if changes have happened, send a PUT request with the study data as the body
        const updatedStudy = await StudyService.updateStudy(study.id, study);

        if (updatedStudy && updatedStudy.study) {
                localStorageCleanup();

                // find index of the study that is currently in progress and display correct information if changes have happened to UI w/o reloading
                const studyIndex = user.studies.findIndex(study => study.id === updatedStudy.study.id);

                // first update the tracking of the initial and current study
                updateSaveHistory();
        } else {
            console.log(updatedStudy, updatedStudy.study);
            emit('unableSave');
        }
            return;
    } else if (study && !noChanges) {
        // if changes have happened, send a PUT request with the study data as the body
        const updatedStudy = await StudyService.updateStudy(study.id, study);

        if (updatedStudy && updatedStudy.study) {
            // find index of the study that is currently in progress and display correct information if changes have happened to UI w/o reloading
            const studyIndex = user.studies.findIndex(study => study.id === updatedStudy.study.id);

            // first update the tracking of the initial and current study
            updateSaveHistory();

            // if updatedStudy id is found within user.studies
            if (studyIndex !== -1) {
                user.studies[studyIndex] = JSON.parse(JSON.stringify(updatedStudy.study));
            }
        } else {
            console.log('Unable to save updated study', updatedStudy, updatedStudy.study);
            emit('unableSave');
        }
            return;
        }
    } catch (error) {
        // console.error('Error saving study:', error);
        if (error && error.errors) {
            console.error('Schema validation errors:');
            for (const field in error.errors) {
                console.error(`${field}: ${error.errors[field].message}`);
            }

            localStorage.removeItem('unsavedStudy');
            localStorage.removeItem('isEditingStudy');

        } else emit('unableSave');
    }
};


// set status to either 'ongoing' or 'completed' depending on the publish/close button
const setStudyStatus = async (status) => {
    // return if it hasn't been saved yet -> should probably show a prompt box of sorts
    const noChanges = compareStudies(study, initialStudy);

    // if there is changes and it hasn't been created yet, show a prompt box telling them to save, else publish the study
    if (!noChanges) return emit('unableSave', { reason: 'save' });

    const studyIndex = user.studies.findIndex(userStudy => userStudy.id === study.id);

    // don't update if status is already 'ongoing' or 'completed' (depending on set status)
    if (study.status === status) return;

    // if study has zero question, emit reason and return
    if (study.questions.length === 0) {
        return emit('unableSave', { reason: 'noQuestions' });
    }  

    // call the validation functions that only validate before publishing a study
    const invalidDemo = validateDemographics(study);
    validateStudy(study);

    if (invalidDemo || Object.keys(errorQuestions).length > 0) {
        // check here due to the check is part of the 'publish' validation        
        if (invalidDemo) {
            errorMsgs.push('demographics');
            return emit('unableSave', { reason: 'demographics'});
        } else {
            removeErr(true, 'demographics');
        }

        return emit('unableSave');
    }

    try {
        const request = await updateStudyStatus(study.id, status);

        if (!request.success) return console.error('unable publish study')

        const updatedStudy = await request.result;

        // update status, set disabled to true; insert the status for the client-side as well
        if (updatedStudy.updated) {
            // remove the saved study from localStorage
            localStorageCleanup();
            user.studies[studyIndex].status = status;
            study.status = status;
            isDisabled.value = true;
        } else {
            emit('unableSave', { reason: 'noQuestions' });
        }
    } catch (err) {
        console.error('Failed to update study status:', err);
        emit('unableSave', { reason: 'error' });
    }
}
</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-header.scss');
</style>