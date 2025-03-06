<template>
    <div class="question">
        <div class="question__container">
            <h2 class="question__title">Questions</h2>
            <button class="question__add" aria-label="add new question" @click="addQuestion"> + </button>
        </div>
        <ul class="question__list" ref="listRef" id="question__list">
            <Study-item @select="(data) => selectQuestion(data)" parent="#question__list" :config="question" :index="i"
                v-for="(question, i) in questions" />
        </ul>
    </div>
</template>

<script setup>
import { study } from '~/public/script/reactive';

const listRef = ref('')
const emit = defineEmits(['select'])

//returning the array of questions
const questions = computed(() => {
    return study.questions
})

//handling so the selected question is emitted and displayed in main-area
const selectQuestion = (data) => {
    emit('select', { query: data.query, number: data.number, id: data.id })
}

//function is responsible of adding question when button to do so is clicked
const addQuestion = () => {
    //blueprint for how the question-object is arranged
    const questionBp = {
        id: crypto.randomUUID(),
        question: 'Write a new question',
        //setting draft as default for status
        status: 'draft',
        closingMethod: [],
        closingLimit: {
            date: null,
            duration: null,
            replies: null,
        },
        required: true,
        type: null,
        range: {
            //setting some default values
            min: 0,
            max: 100
        },
        options: [],
        artifacts: []
    };

    const question = JSON.parse(JSON.stringify(questionBp));

    study.questions.push(question);

    //so the new question is displayed in the page when requested to be made
    selectQuestion({ query: 'question', number: questions.value.length - 1, id: question.id })
}




</script>

<style scoped></style>