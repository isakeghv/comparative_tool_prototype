<template>
    <div class="slide__cont--two">
        <div class="aside__container slide__cont">
            <p class="font-large font-semi">Response format</p>
            <button class="slide__btn" @click="$emit('toggle')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="slide__svg">
                    <path d="M500-640v320l160-160-160-160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z"/>
                </svg>
            </button>
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
    </div>
</template>

<script setup>
import { study, showResponses } from '~/public/script/reactive';
const isDisabled = inject('disabled');

const props = defineProps({
    index: Number,
    id: String
});

const emit = defineEmits(['update:modelValue', 'delete', 'hideSidebar', 'toggle']);

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

const exit = () => {
    emit('hideSidebar');
}

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
    const i = study.questions.findIndex(q => q.id === props.id);

    emit('delete', props.id, i);
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
