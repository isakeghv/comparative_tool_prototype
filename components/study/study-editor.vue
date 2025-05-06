<!-- return main area of the created study based on the computed properties (showDetails, showDemographics, showQuestionMain) -->
<template>
    <div class="container">
        <StudySidebar @swapDisplay="(data) => toggleDisplay(data.component, data.number, data.id)" />
        <ResponsesData v-if="showStudyData" />
        <Details v-if="showDetails" />
        <Demographic v-if="showDemographics" />
        <StudyConsentForm v-if="showTerms" />
        <StudyMain v-if="showQuestionMain" :index="questionIndex" :id="questionId" />
        <StudyPreview :study="study" v-if="showPreview"/>
    </div>
</template>

<script setup>
import StudyConsentForm from './study-consent-form.vue';
import { allUploadedArtifacts, study, showPreview } from '~/public/script/reactive';
import StudyPreview from './preview/study-preview.vue';

const emit = defineEmits(['unableSave'])

// const forwardErrorMsg = (err) => {
//     emit('unableSave', err);
// };

// show details as default when opening/creating a study
const displayComponent = ref('details');
const questionIndex = ref();
const questionId = ref()

const showDetails = computed(() => {
    return displayComponent.value === 'details'
})


const showStudyData = computed(() => {
    return displayComponent.value === 'data'
})

const showDemographics = computed(() => {
    return displayComponent.value === 'demographics'
})

const showQuestionMain = computed(() => {
    return displayComponent.value === 'question'
})

const showTerms = computed(() => {
    return displayComponent.value === 'terms'
})

//resets it when the editor page is loaded: to avoid any potential issues


const trackExistingArtifacts = () => {
    allUploadedArtifacts.value = [];

    study.questions.forEach(q => {
        q.artifacts.forEach(a => {
            const isInArr = allUploadedArtifacts.value.some(b => JSON.stringify(b) === JSON.stringify(a));
            if (!isInArr) allUploadedArtifacts.value.push(a);
        });
    });
    console.log(allUploadedArtifacts.value);
}

trackExistingArtifacts();

//handles toggling of which component to display. "number = null" is responsible of handling which question to open
const toggleDisplay = (component, number, id) => {
    displayComponent.value = component;

    //to use in order to know which question to get from array. 
    // First check the array[questionIndex.value], and check that the id "questionId.value" corresponds. If true, return that item
    // if false (and only if false) iterate through array untill id matches "questionId.value"
    questionIndex.value = number
    questionId.value = id;
}
</script>

<style scoped>
@import url('public/style/pages/study/study.scss');
</style>