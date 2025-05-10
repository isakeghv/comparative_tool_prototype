<template>
    <div class="overlay" @click="exit()"></div>
    <div class="modal">
        <div class="modal__header">
            <button class="modal__exit" @click="exit()" id="unable-save-exit">
                <svg xmlns="http://www.w3.org/2000/svg" class="modal__cross" viewBox="0 -960 960 960">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
            </button>
        </div>

        <!-- show the general error message if available -->
        <p v-if="info.reason && info.reason !== 'demographics'" class="modal__paragraph">
            {{ message }}
        </p>

        <!-- show error messages for each question + demographics message if errors there -->
        <div v-else-if="info.reason == 'demographics' || Object.keys(errorQuestions).length > 0">
            <p v-if="info.reason == 'demographics'" class="modal__paragraph">
                {{ message }}
            </p>
            <template v-if="Object.keys(errorQuestions).length > 0">
                <p v-for="(categories, questionId) in errorQuestions" :key="questionId">
                    <template v-if="categories.length > 0">
                        <strong>Question {{ getIndex(questionId) }}:</strong>
                        {{ formatErrorMessage(categories) }}
                    </template>
                </p>
            </template>
        </div>

    </div>
</template>

<script setup>
import { study, errorQuestions } from '~/public/script/reactive';

const props = defineProps({
    info: Object,
});

const emit = defineEmits(['exit']);

const exit = () => {
    emit('exit');
};

// ensure each question display a verbose message on error
const errorCategoryMessages = {
    artifacts: 'Missing artifacts.',
    checkbox: 'Checkbox must be within a valid range, and min must not exceed max.',
    drop: 'At least one drop option must be non-empty.',
    range: 'Range must be between 1 and 100, and min must not exceed max.'
};

// function to get the index of the question based on its ID
const getIndex = (id) => {
    const question = study.questions.find(q => q.id === id);
    return question ? study.questions.indexOf(question) + 1 : '?';
};

const formatErrorMessage = (categories) => {
    if (Array.isArray(categories)) {
        return categories.map(category => errorCategoryMessages[category]).join(' ');
    } else {
        return errorCategoryMessages[categories];
    }
};

// display descriptive message based on the reason
const message = computed(() => {
    switch (props.info.reason) {
        case 'save':
            return 'Please save your changes before publishing the study.';
        case 'noTitle':
            return 'Title is required.';
        case 'noQuestionTitle':
            return 'Each question must have a title.';
        case 'noQuestions':
            return 'Your study must include at least one question.';
        case 'demographics':
            return 'One or more demographic questions have missing title, options or invalid number ranges.';
        default:
            return 'Some required fields are missing. Please review your study.';
    }
});

// lock and restore scroll
onMounted(() => {
    document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
    document.body.style.overflow = '';
});
</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-unableSave.scss');
</style>
