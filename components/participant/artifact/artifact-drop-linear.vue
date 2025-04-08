<template>
    <div class="question__cont--btm drop_zone">
        <div class="drop_container drop_container--text font-medium font-large">
            <p class="drop__label">{{ labels.startLabel }}</p>
            <p class="drop__label">{{ labels.endLabel }}</p>
        </div>
        <div class="drop_container drop_container--linear" @mouseover="mouseover" @mouseleave="mouseleave" @mousemove="mousemove">
            <div v-for="(artifact, index) in participantAnswer[questionid]" :key="artifact.id"
                :ref="element => setRef(element, index)"
                class="artifact__container artifact__container--small artifact__borderless drop_relative"
                >
                <button class="drop__button drop__button--left" aria-label="Move item up in order" @click="up(index)"
                    v-if="index !== 0">
                    <svg class="drop_arrow" viewBox="0 0 61 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M60.8701 100.35L53.7401 107.48L0 53.7401L53.7401 0L60.8701 7.12994L14.2599 53.7401L60.8701 100.35Z"
                            fill="black" />
                    </svg>
                </button>
                <img :src="artifact.source" :alt="artifact.id" class="artifact__image artifact__image--transition"
                    v-if="isImage(artifact.source)" />
                <embed :src="artifact.source" :alt="artifact.id" class="artifact__image  artifact__image--transition"
                    v-if="isPdf(artifact.source)" />
                <audio :src="artifact.source" :alt="artifact.id" class="artifact__image  artifact__image--transition"
                    v-if="isAudioFile(artifact.source)" />
                <video :src="artifact.source" :alt="artifact.id" class="artifact__image  artifact__image--transition"
                    v-if="isVideoFile(artifact.source)" />
                <button class="drop__button drop__button--right" aria-label="Move item down in order"
                    @click="down(index)" v-if="index + 1 < participantAnswer[questionid]?.length">
                    <svg class="drop_arrow" viewBox="0 0 62 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0.870056 100.61L8 107.74L61.7401 53.9999L8 0.259766L0.870056 7.38971L47.4802 53.9999L0.870056 100.61Z"
                            fill="black" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '~/utils/fileUtils.js';
import { participantAnswer } from '~/public/script/participant';

const props = defineProps({
    questionid: String,
    labels: Object,
})

const emit = defineEmits(['mouseover', 'mouseleave', 'moveup', 'movedown', 'insertAt']);

const mouseover = () => emit('mouseover');
const mouseleave = () => emit('mouseleave');

const itemRefs = ref([])

const setRef = (element, index) => itemRefs.value[index] = element

//gets the index at which the new item should be dropped
const getIndex = (refs, cursorX) =>{
    for (let i = 0; i < refs.length; i++){
        const item = refs[i];
        if (!item) continue;
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + (itemRect.width / 2);

        if (cursorX < itemCenter) return i;
    }
	return refs.length;
}

//used to track where the cursor is placed relatively to the items in the array
const mousemove = (event) =>{
    const cursorX = event.clientX

    const index = getIndex(itemRefs.value, cursorX)

    emit('insertAt', index)
}

const up = (index) => emit('moveup', index);
const down = (index) => emit('movedown', index);

</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
@import url('public/style/components/participant/participant-question.scss');
</style>