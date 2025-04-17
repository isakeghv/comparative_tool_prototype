<!-- return main area of the created study based on the computed properties (showDetails, showDemographics, showQuestionMain) -->
<template>
    <div class="container">
        <StudySidebar @swapDisplay="(data) => toggleDisplay(data.component, data.number, data.id)"/>
        <Details v-if="showDetails" />
        <Demographic v-if="showDemographics" :demographicMap="demographicMap"/>
        <StudyConsentForm v-if="showTerms" />
        <StudyMain v-if="showQuestionMain" :index="questionIndex" :id="questionId" :answers="studyResponses" />
	</div>
</template>

<script setup>
import StudyConsentForm from './study-consent-form.vue';

const emit = defineEmits(['unableSave'])

// const forwardErrorMsg = (err) => {
//     emit('unableSave', err);
// };

const props = defineProps({
    studyResponses: Array
});

// compute the `studyResponses` props, and check if it has at least one response
const selectedResponse = computed(() => props.studyResponses?.[0] ?? {});

// for aggregated results ('all/graphs'): map both the `demographic` and `questions` of each participant to an object
// in the format { questionId_1: [answers], questionId_2: [answers] }
// const answerMap = computed(() => {
//     const map = {};

//     const rawResponses = toRaw(selectedResponse);
//     rawResponses?.value.questions?.forEach((q) => {
//         if (q.id) map[q.id] = q.answer;
//     });

//     return map;
// });

const demographicMap = computed(() => {
    const map = {};

    const rawResponses = toRaw(selectedResponse);
    rawResponses?.value.demographic?.forEach((d) => {
        if (d.id) map[d.id] = d.value;
    });

    return map;
});

// show details as default when opening/creating a study
const displayComponent = ref('details');
const questionIndex = ref();
const questionId = ref()

const showDetails = computed(()=>{
    return displayComponent.value === 'details'
})

const showDemographics = computed(()=>{
    return displayComponent.value === 'demographics'
})

const showQuestionMain = computed(()=>{
    return displayComponent.value === 'question'
})

const showTerms = computed(()=>{
    return displayComponent.value === 'terms'
})

//handles toggling of which component to display. "number = null" is responsible of handling which question to open
const toggleDisplay = (component, number, id)=>{
    displayComponent.value = component;

    //to use in order to know which question to get from array. 
    // First check the array[questionIndex.value], and check that the id "questionId.value" corresponds. If true, return that item
    // if false (and only if false) iterate through array untill id matches "questionId.value"
    questionIndex.value = number
    questionId.value = id;
}

// console.log("readonly prop in setup:", props.disabled);
</script>

<style scoped>
    @import url('public/style/pages/study/study.scss');
</style>