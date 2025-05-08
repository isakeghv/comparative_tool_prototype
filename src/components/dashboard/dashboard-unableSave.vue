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
        <p v-if="info.reason" class="modal__paragraph">
            {{ message }}
        </p>

        <!-- show error messages for each question -->
        <div v-else-if="Object.keys(errorQuestions).length > 0">
                <p v-if="errorQuestions['demographics']">Demographicsss</p>
                <p v-for="(categories, questionId) in errorQuestions" :key="questionId">
                    <strong>Question {{ getIndex(questionId) }}:</strong>
                    {{ formatErrorMessage(categories) }}
                </p>
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

// Ensure the `errorCategoryMessages` is complete
const errorCategoryMessages = {
    // title: 'Title is required.',
    artifacts: 'Missing artifacts.',
    checkbox: 'Checkbox must be within a valid range, and min must not exceed max.',
    drop: 'At least one drop option must be non-empty.',
    range: 'Range must be between 1 and 100, and min must not exceed max.'
};

// Function to get the index of the question based on its ID
const getIndex = (id) => {
    const question = study.questions.find(q => q.id === id);
    return question ? study.questions.indexOf(question) + 1 : '?';
};

const formatErrorMessage = (categories) => {
    return categories.map(category => errorCategoryMessages[category]).join(' ');
};

// Display dynamic message based on the reason
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
        case 'noArtifacts':
            return 'Each question must have at least one artifact.';
        default:
            return 'Some required fields are missing. Please review your study.';
    }
});

// Lock scroll
onMounted(() => {
    document.body.style.overflow = 'hidden';
});

// Restore scrolling
onBeforeUnmount(() => {
    document.body.style.overflow = '';
});
</script>

<style scoped>
@import url('public/style/components/dashboard/dashboard-unableSave.scss');

.error-block {
  margin-bottom: 1rem;
}
.error-block ul {
  margin: 0.25rem 0 0 1rem;
  padding: 0;
  list-style-type: disc;
}
</style>
