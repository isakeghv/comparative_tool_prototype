<template>
    <aside class="aside">
        <div class="aside__container">
            <p class="font-large font-semi">Response format</p>
        </div>

        <StudyResponseOption
            v-for="option in options"
            :key="option.value"
            :text="option.text"
            :value="option.value"
            :index="props.index"
            :id="props.id"
            :modelValue="currentResponseType"
            @update:modelValue="updateResponseType"
            :disabled="isDisabled"
        />
        
        <div class="aside__container aside__selection">
            <label for="demographic_required_checkbox" class="aside__label aside__label--headline font-normal font-medium">
                Required
            </label>
            <input
                type="checkbox"
                id="demographic_required_checkbox"
                class="aside__checkbox"
                v-model="requiredModel"
                @change="updateRequired()"
                :disabled="isDisabled"
            />
        </div>

        <div class="aside__container aside__container--borderless">
            <button v-if="!isDisabled" class="aside__button aside__button--delete font-semi font-small" @click="deleteQuestion()">
                Delete question
            </button>
        </div>
    </aside>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const isDisabled = inject('disabled');

const props = defineProps({
    index: Number,
    id: String
});

const emit = defineEmits(['update:modelValue', 'deleteQuestion']);

// only need to store if the question is required as ref due to response/question being handled by computed properties
const requiredModel = ref(false);

// find the specific question to modify data
const getQuestion = (id) => study.questions.find(q => q.id === id);
const currentQuestion = computed(() => getQuestion(props.id));

// use computed getter/setter to read and write the question's response type directly to source data
const currentResponseType = computed({
    get: () => {
        const question = currentQuestion.value;
        return question.responseType || 'radio';
    },
    set: (newValue) => {
        const question = getQuestion(props.id);
        if (question) {
            question.responseType = newValue;
        }
    }
});

const options = [
    { text: "Multiple choice", value: "radio" },
    { text: "Checkbox", value: "checkbox" },
    { text: "Range", value: "range" },
    { text: "Drag and drop", value: "drop" },
    { text: "Linear sorting", value: "linear" },
];

// update the response type when selected
const updateResponseType = (newValue) => {
    const question = getQuestion(props.id);

    if (question) {
        question.responseType = newValue;
        emit('update:modelValue', newValue);
    }
};

// initialize the required model from the current question
const initializeRequired = () => {
    const question = getQuestion(props.id);
    if (question) {
        requiredModel.value = question.required || false;
    }
};

const updateRequired = ()=>{
    const thisQuestion = getQuestion(props.id)
    thisQuestion.required = requiredModel.value;
}

// should switch to next question when deleting a question
const deleteQuestion = () => {
    const thisQuestion = getQuestion(props.id);
    study.questions = study.questions.filter(q => q !== thisQuestion);

    // emit('deleteQuestion', nextQuestion.id);
}

// similar to the child component, initialize required model when id changes
watch(
    () => props.id,
    (newId) => {
        if (newId) {
            initializeRequired();
        }
    },
    { immediate: true }
);

// re-initialize when questions array changes
watch(
    () => study.questions,
    () => {
        initializeRequired();
    },
    { deep: true }
);
</script>

<style scoped>
    @import url('public/style/components/study/study-aside.scss');
</style>
