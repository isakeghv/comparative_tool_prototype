<template>
    <div class="details__container">
        <div class="details__main">
        <label for="details__title_input" class="details__label hide">Title</label>
        <input type="text" id="details__title_input" class="details__input font-h4 font-medium" placeholder="Title" v-model="titleModel" @input="updateTitle(titleModel)">

        <label for="details__textarea" class="details__label font-h6 font-medium">Description</label>
        <textarea id="details__textarea" class="details__textarea font-normal"  v-model="descrModel" @input="updateDesc(descrModel)"></textarea>
    </div>
    </div>
    <Details-aside/>
    <!-- :id="selectedId" v-if="requestModel" -->
</template>

<script setup>
import { study } from '~/public/script/reactive';

const titleModel = ref('');
const descrModel = ref('');

//updating content of reactive variable "study.title"
const updateTitle = (vmodel) =>{
    study.title = vmodel;
} 

//updating content of reactive variable "study.description"
const updateDesc = (vmodel) =>{
    study.description = vmodel;
} 

//initiating content, so title and description has correct content when component is opened
const initiateContent = ()=>{
    if (study.title) title.value = study.title;
    if (study.description) description.value = study.description;
}

//calling function when component is displayed
initiateContent();
</script>

<style scoped>
    @import url('public/style/components/details/details.scss');
</style>