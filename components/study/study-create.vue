<template>
    <Study-aside @swapComponent="(data) =>toggleDisplay(data.component, data.number)"/>
    <Study-details v-if="showDetails"/>
    <Demographic v-if="showDemographics"/>
</template>

<script setup>
import { study } from '~/public/script/reactive';
import Demographic from './demographic/demographic.vue';

const displayComponent = ref('');
const questionNumber = ref();

const showDetails = computed(()=>{
    return displayComponent.value === 'details'
})

const showDemographics = computed(()=>{
    return displayComponent.value === 'demographics'
})

//handles toggling of which component to display. "number = null" is responsible of handling which question to open
const toggleDisplay = (component, number)=>{
    displayComponent.value = component;
    questionNumber.value = number
}

</script>