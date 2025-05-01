<template>
    <button class="sidebar__return font-normal" @click="goBack()">
        <svg class="sidebar__arrow" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.79062 12.3633L0.183037 6.77236C0.116478 6.7058 0.0694431 6.6337 0.0419321 6.55605C0.0139774 6.4784 0 6.3952 0 6.30645C0 6.21771 0.0139774 6.13451 0.0419321 6.05686C0.0694431 5.9792 0.116478 5.9071 0.183037 5.84054L5.79062 0.232956C5.94592 0.0776519 6.14005 0 6.37301 0C6.60597 0 6.80564 0.0831986 6.97204 0.249596C7.13844 0.415993 7.22164 0.610123 7.22164 0.831986C7.22164 1.05385 7.13844 1.24798 6.97204 1.41438L2.07996 6.30645L6.97204 11.1985C7.12734 11.3538 7.205 11.5451 7.205 11.7723C7.205 11.9999 7.1218 12.1969 6.9554 12.3633C6.789 12.5297 6.59487 12.6129 6.37301 12.6129C6.15115 12.6129 5.95702 12.5297 5.79062 12.3633Z"
                fill="black" />
        </svg>
        <span class="font-normal font-semi">Return to dashboard</span>
    </button>
</template>

<script setup>
import { study, initialStudy, showResponses } from '~/public/script/reactive'
import { user } from '~/public/script/reactive';
import { compareStudies } from '~/utils/studyUtils';
const isDisabled = inject('disabled');
const studyResponses = inject('studyResponses');

const props = defineProps({
    current: Object,
    initial: Object,
})



//resetting variables there is no issue incorrect information being displayed when opening different study
const resetVariables = () => {
    study.id = null;
    study.title = null;
    study.description = null;
    study.demographicReq = true;
    study.demographic = [];
    study.customTerms.request = false;
    study.customTerms.terms = '';
    study.questions = [];
    study.closingMethod = '';
    study.closingLimit.date = '';
    study.closingLimit.duration = '';
    study.closingLimit.responses = '';
    study.desiredResponses = '';
 
    initialStudy.title = null;
    initialStudy.description = null;
    initialStudy.demographicReq = true;
    initialStudy.demographic = [];
    initialStudy.customTerms.request = false;
    initialStudy.customTerms.terms = '';
    initialStudy.questions = [];
    initialStudy.closingMethod = '';
    initialStudy.closingLimit.date = '';
    initialStudy.closingLimit.duration = '';
    initialStudy.closingLimit.responses = '';
    initialStudy.desiredResponses = '';
}

//fixes so the UI is updated with correct title etc in dashboard
const updateStudyUI = () =>{
    const i = user.studies.findIndex(us => us.id === study.id);
    user.studies[i] = JSON.parse(JSON.stringify(study));
}

const goBack = () => {

    // no need to check if study isn't editable anymore; delete item from sessionStorage that tracks which participant the researcher checks the result of
    if (isDisabled.value) {
        sessionStorage.removeItem('participantNum');
        sessionStorage.removeItem('selectedView');
        studyResponses.value = [];
        showResponses.value = false;
        updateStudyUI();
        return resetVariables();
    }

    // compare the current and initial version of the studies
    const isAlike = compareStudies(props.current, props.initial);

    if (isAlike) {
        updateStudyUI();
        localStorage.removeItem('unsavedStudy');
        localStorage.removeItem('isEditingStudy');
        resetVariables();
    } else if (!isDisabled.value) {
        const userChoice = confirm('Changes have not been saved. Do you want to discard changes and return to the dashboard?');
        if (userChoice) {
            localStorage.removeItem('unsavedStudy');
            localStorage.removeItem('isEditingStudy');
            resetVariables();
        }
    }
}

//to prevent page reload if changes have not been saved
onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
});

//Removing eventlistener in "onMounted"
onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
});

const handleBeforeUnload = () => {
    resetVariables();
};

</script>

<style scoped>
    @import url('public/style/components/study/study-sidebar.scss');
</style>