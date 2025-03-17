<!-- return main area of the created study based on the computed properties (showDetails, showDemographics, showQuestionMain) -->
<template>
    <div class="container">
        <StudySidebar @swapDisplay="(data) => toggleDisplay(data.component, data.number, data.id)"/>
        <Details v-if="showDetails"/>
        <Demographic v-if="showDemographics"/>
        <StudyTermsPrivacy v-if="showTerms"/>
        <StudyMain v-if="showQuestionMain" :index="questionIndex" :id="questionId"/>
    </div>
</template>

<script setup>

const displayComponent = ref('');
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

</script>

<style scoped>
    @import url('public/style/pages/study/study.scss');
</style>