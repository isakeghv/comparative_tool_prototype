<template>
    <div class="details__container">
        <label for="study_title_input" class="details__label hide">Title</label>
        <input type="text" id="study_title_input" class="details__input font-h1" v-model="titleModel" @input="updateTitle(titleModel)">

        <label for="study_details_textarea" class="details__label hide">Description</label>
        <textarea id="study_details_textarea" class="details__textarea font-normal"  v-model="descrModel" @input="updateDesc(descrModel)"></textarea>
    </div>
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

</style>