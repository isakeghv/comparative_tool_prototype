<template>
    <div class="preview" @pointerdown="preventScroll">
        <div class="preview-header">
            <button class="preview-exit" aria-label="Exit preview" @click="showPreview = false">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="#e3e3e3">
                    <path
                        d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
            </button>
        </div>
        <StudyPreviewIntro v-if="study && showIntro" :study="study" :handleStart="handleStart" />

        <StudyPreviewMain v-if="study && start" :study="study" />
    </div>
    <button class="preview-overlay" aria-label="Exit preview" @click="showPreview = false"></button>
</template>

<script setup>
import StudyPreviewIntro from './study-preview-intro.vue';
import StudyPreviewMain from './study-preview-main.vue';
import { showPreview } from '~/public/script/reactive';

const props = defineProps({
    study: Object
})

// show view depending on which page the user is on
const currentView = ref('intro');

// set to true when user clicks continue or sm
const start = ref(false);

const showIntro = computed(() => currentView.value === 'intro');

// when clicked on start, create a participant session
const handleStart = () => {
    start.value = true;

    // show questions after clicking on start (this needs a bit more thinking... design-wise)
    currentView.value = "questions";
}

</script>

<style scoped>
@import url('public/style/pages/participant/participant.scss');

.preview-header {
    height: 2.5rem;
    width: 100%;
    background-color: white;
    border-bottom: solid #CCCCCC 1px;
    border-radius: 0.25rem 0.25rem 0 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0.5rem;
}

.preview-exit{
    border: none;
    background-color: rgb(40, 40, 40);
    cursor: pointer;
    border-radius: 0.25rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
}

.preview {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: fixed;
    height: 98%;
    width: 98%;
    background-color: white;
    z-index: 3;
    border-radius: 0.25rem;
    overflow-y: auto;
}

.preview-overlay {
    display: block;
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.6);
    border: none;
}
</style>