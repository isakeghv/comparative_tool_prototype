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
      
        <div v-if="errorMsgs.length">
            <div v-for="(msg, index) in errorMsgs" :key="index">
                {{ msg }}
            </div>
        </div>
        <p v-else class="modal__paragraph">
            {{  message }}
        </p>
    </div>
</template>

<script setup>
import { errorMsgs } from '~/public/script/reactive';

const props = defineProps({
    errors: Array,
    info: Object
});

const emit = defineEmits(['exit']);

const exit = () => {
    emit('exit');
}

const message = computed(() => {
    if (props.info.reason === 'save') {
        return 'Save changes before publishing.';
    }

    if (props.info.reason === 'noQuestions') {
        return 'At least one question is required to publish the study.';
    }

    return 'Some required fields are missing. Please ensure that the study details include a title for example.';
});

// need to override the body styling due to scrollbar gutter
onMounted(() => {
    document.body.style.overflow = 'hidden';
});

// restore scrolling
onBeforeUnmount(() => {
    document.body.style.overflow = '';
});
</script>

<style scoped>
@import url('public/style/components/dashboard/dashboard-unableSave.scss');
</style>