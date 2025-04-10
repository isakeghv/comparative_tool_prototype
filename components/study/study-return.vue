<template>
    <button class="sidebar__return font-normal" @click="goBack()">
        <svg class="sidebar__arrow" viewBox="0 0 8 13" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5.79062 12.3633L0.183037 6.77236C0.116478 6.7058 0.0694431 6.6337 0.0419321 6.55605C0.0139774 6.4784 0 6.3952 0 6.30645C0 6.21771 0.0139774 6.13451 0.0419321 6.05686C0.0694431 5.9792 0.116478 5.9071 0.183037 5.84054L5.79062 0.232956C5.94592 0.0776519 6.14005 0 6.37301 0C6.60597 0 6.80564 0.0831986 6.97204 0.249596C7.13844 0.415993 7.22164 0.610123 7.22164 0.831986C7.22164 1.05385 7.13844 1.24798 6.97204 1.41438L2.07996 6.30645L6.97204 11.1985C7.12734 11.3538 7.205 11.5451 7.205 11.7723C7.205 11.9999 7.1218 12.1969 6.9554 12.3633C6.789 12.5297 6.59487 12.6129 6.37301 12.6129C6.15115 12.6129 5.95702 12.5297 5.79062 12.3633Z"
                fill="black" />
        </svg>
        <span class="font-normal font-semi" @click="resetStudyCreatedFlag">Return to dashboard</span>
    </button>
</template>

<script setup>
import { study, initialStudy, wasStudyCreated } from '~/public/script/reactive'
import { compareStudies } from '~/utils/studyUtils';
const isDisabled = inject('disabled');

const props = defineProps({
    current: Object,
    initial: Object,
})

// because our application doesn't detect reloads, the flag needs to update when returning back to dashboard
const resetStudyCreatedFlag = () => {
    wasStudyCreated.value = false;
}

// //looping over arrays, and checking if they are the same, to make sure unsaved changed are not lost
// const compareArray = (arr1, arr2) => {
//     for (let i = 0; i < arr1.length; i++) {
//         const item1 = arr1[i]
//         const item2 = arr2[i]
//         if (item1 !== item2) return false
//     }
//     return true;
// }

// //flattens array so objects can be compared correctly.
// const flattenArray = (arr) => {
//     //make sure it is an array
//     if (!Array.isArray(arr)) return [];

//     //if all good, continue flattening array
//     return arr.flatMap(obj =>
//         Object.values(obj || {}).flatMap(v => (typeof v === 'object' && v !== null) ? flattenArray([v]) : v)
//     );
// };

// //comparing the current update with last saved to make sure unsaved changes are not ost
// const compareStudy = () => {
//     const similarArrays = compareArray(flattenArray(props.current.questions), flattenArray(props.initial.questions)) &&
//                           compareArray(flattenArray(props.current.demographic), flattenArray(props.initial.demographic));
                          
//     // console.log(props.current.questions, props.initial.questions)
//     return props.current.demographicReq === props.initial.demographicReq &&
//         props.current.description === props.initial.description &&
//         props.current.title === props.initial.title &&
//         JSON.stringify(props.current.demographic) === JSON.stringify(props.initial.demographic) &&
//         JSON.stringify(props.current.questions) === JSON.stringify(props.initial.questions) &&
//         JSON.stringify(props.current.customTerms) === JSON.stringify(props.initial.customTerms) &&
//         JSON.stringify(props.current.closingMethod) === JSON.stringify(props.initial.closingMethod) &&
//         JSON.stringify(props.current.closingLimit) === JSON.stringify(props.initial.closingLimit) &&
//         props.current.desiredResponses === props.initial.desiredResponses &&
//         similarArrays;
// };

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

const goBack = () => {
    // no need to check if study isn't editable anymore
    if (isDisabled.value) {
        return resetVariables();
    }

    // compare the current and initial version of the studies
    const isAlike = compareStudies(props.current, props.initial);

    if (isAlike) {
        resetVariables();
    } else if (!isDisabled.value) {
        const userChoice = confirm('Changes have not been saved. Do you want to discard changes and return to the dashboard?');
        if (userChoice) {
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