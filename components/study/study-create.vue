<template>
    <Study-aside @swapDisplay="(data) =>toggleDisplay(data.component, data.number, data.id)"/>
    <Study-details v-if="showDetails"/>
    <Demographic v-if="showDemographics"/>
    <Study-main v-if="showQuestionMain" :index="questionIndex" :id="questionId"/>
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