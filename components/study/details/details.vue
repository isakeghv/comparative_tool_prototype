<template>
    <div class="details__container">
        <div class="details__main">
        <label for="details__title_input" class="details__label hide">Title</label>
        <input type="text" id="details__title_input" class="details__input font-h4 font-medium" placeholder="Title" v-model="titleModel" @input="updateTitle(titleModel)" :disabled=isDisabled>

        <label for="details__textarea" class="details__label font-h6 font-medium">Description</label>
        <textarea id="details__textarea" class="details__textarea font-normal"  v-model="descrModel" @input="updateDesc(descrModel)" :disabled=isDisabled></textarea>
    </div>
    </div>
    <DetailsAside />
</template>

<script setup>
import { study, errorMsgs } from '~/public/script/reactive';
const isDisabled = inject('disabled'); 

const titleModel = ref('');
const descrModel = ref('');

const updateTitle = (input) => {
    study.title = input;
}

//updating content of reactive variable "study.description"
const updateDesc = (input) =>{
    study.description = input;
} 

//initiating content, so title and description has correct content when component is opened
const initiateContent = () => {
    if (study.title) titleModel.value = study.title;
    if (study.description) descrModel.value = study.description;
}

//calling function when component is displayed
initiateContent();

watch(() => titleModel.value, (newVal) => {
    const msg = 'Study title is required.';

    // if title is empty, store the message if it doesn't exist already
    if (newVal.trim() === '') {    
        if (!errorMsgs.list.includes(msg)) {
            errorMsgs.list.push(msg);
        }
    } else {
        const index = errorMsgs.list.indexOf(msg);

        if (index !== -1) {
            errorMsgs.list.splice(index, 1);
        }
    }
});

</script>

<style scoped>
    @import url('public/style/components/details/details.scss');
</style>