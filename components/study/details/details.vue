<template>
    <div class="details__container">
        <div class="details__main">
        <label for="details__title_input" class="details__label hide">Title</label>
        <input type="text" id="details__title_input" class="details__input font-h4 font-medium" placeholder="Title" v-model="titleModel" :disabled=isDisabled maxlength="75" required>
        <label for="details__textarea" class="details__label font-h6 font-medium">Description</label>
        <textarea id="details__textarea" class="details__textarea font-normal"  v-model="descrModel" :disabled=isDisabled maxlength="3000"></textarea>
    </div>
    </div>
    <DetailsAside />
</template>

<script setup>
import { study, errorMsgs } from '~/public/script/reactive';
const isDisabled = inject('disabled'); 

const titleModel = computed({
  get: () => study.title,
  set: (val) => study.title = val
});

const descrModel = computed({
  get: () => study.description,
  set: (val) => study.description = val
});

const emit = defineEmits(['validate']);

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
    if (!newVal || newVal.trim() === '') {      
        if (!errorMsgs.value.includes(msg)) {
            errorMsgs.value.push(msg);
        }
    } else {
        // else remove it
        const index = errorMsgs.value.indexOf(msg);

        if (index !== -1) {
            errorMsgs.value.splice(index, 1);
        }
    }
}, { immediate: true });
</script>

<style scoped>
    @import url('public/style/components/details/details.scss');
</style>