<template>
    <aside class="aside">
        <div class="aside__container">
            <p class="font-large font-semi">Response format</p>
        </div>

        <Study-response-option v-model="responseModel" :text="option.text" :value="option.value" :key="option.value" :id="props.id" 
            v-for="option in options" :question="selectedQuestion" @update:questionValues="handleQuestionValues($event)"
        />

        <div class="aside__container aside__selection">
            <label for="demographic_required_checkbox" class="aside__label aside__label--headline font-normal font-medium">
                Required
            </label>
            <input type="checkbox" id="demographic_required_checkbox" class="aside__checkbox" v-model="requiredModel" @change="updateRequired()">
        </div>
        <div class="aside__container aside__container--borderless">
            <button class="aside__button aside__button--delete" @click="deleteQuestion()">
                Delete question
            </button>
        </div>
    </aside>
</template>

<script setup>
import { study } from '~/public/script/reactive';

const props = defineProps({
    index: Number,
    id: String
});

const selectedQuestion = ref(null);
const questionModel = ref('');
const requiredModel = ref('');
const responseModel = ref('');

// find the specific question to modify data
const getQuestion = (id) => study.questions.find(q => q.id === id);

// define the options for the response type
const options = [
    { text: "Multiple choice", value: "radio" },
    { text: "Checkbox", value: "checkbox" },
    { text: "Range", value: "range" },
    { text: "Drag and drop", value: "drop" },
    { text: "Linear sorting", value: "linear" },
];

const handleQuestionValues = (updatedValues) => {
    const thisQuestion = getQuestion(props.id);

    // find the current question, and merge with the new values
    if (thisQuestion) {
        Object.assign(thisQuestion, updatedValues);
    }
}

const initiateConfig = (id) => {
    const thisQuestion = getQuestion(id);
    if (!thisQuestion) return;

    selectedQuestion.value = JSON.parse(JSON.stringify(thisQuestion));
    if (!selectedQuestion.value) return;

    // update the values the parent has access to
    questionModel.value = selectedQuestion.value.question;
    responseModel.value = selectedQuestion.value.responseType;
    requiredModel.value = selectedQuestion.value.required;
};

const updateRequired = ()=>{
    const thisQuestion = getQuestion(props.id)
    thisQuestion.required = requiredModel.value;
}

const deleteQuestion = ()=>{
    const thisQuestion = getQuestion(props.id);
    study.questions = study.questions.filter(e => e !== thisQuestion);
}

// watch when question id changes, and show them immediately (had issue with the first question not showing up)
watch(
    () => props.id,
    (id) => {
        initiateConfig(id);
    },
    { immediate: true }
);

// update responsModel type when it gets emitted a new value
watch(
  () => responseModel.value,
  (newValue) => {
    const thisQuestion = getQuestion(props.id);
    if (thisQuestion && thisQuestion.responseType !== newValue) {
      thisQuestion.responseType = newValue;
    }
  }
);


</script>

<style scoped>
    @import url('public/style/components/study/study-aside.scss');
</style>
