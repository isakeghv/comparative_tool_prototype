<template>
    <div class="question__cont--btm drop_zone">
        <div class="drop_container drop_container--text font-medium font-large">
            <p class="drop__label">{{ labels.startLabel }}</p>
            <p class="drop__label">{{ labels.endLabel }}</p>
        </div>
        <div class="drop_container drop_container--linear" @mouseover="mouseover" @mouseleave="mouseleave"
            @mousemove="mousemove">
            <p class="drop__instruction font-normal" v-if="!participantAnswer[questionid]">
                Drag and drop and arrange artifacts here
            </p>
            <div v-for="(artifact, index) in participantAnswer[questionid]" :key="artifact.id"
                :ref="element => setRef(element, index)"
                class="artifact__container artifact__container--small artifact__borderless drop_relative">
                <div class="wrapper wrapper--zero">
                    <ExpandButton @expand="expand(artifact.source, artifact.id)" />
                </div>
                <button class="drop__button drop__button--left" aria-label="Move item up in order" @click="up(index)"
                    v-if="index !== 0">
                    <svg class="drop_arrow" viewBox="0 0 61 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M60.8701 100.35L53.7401 107.48L0 53.7401L53.7401 0L60.8701 7.12994L14.2599 53.7401L60.8701 100.35Z"
                            fill="black" />
                    </svg>
                </button>
                <img :src="artifact.file" :alt="artifact.id" class="artifact__image--transition" :class="classname"
                    v-if="isImage(artifact.source)" />
                <embed :src="artifact.source" :alt="artifact.id" class="artifact__image--transition" :class="classname"
                    v-if="isPdf(artifact.source)" />
                <svg class="artifact__icon artifact__outline artifact__image--transition" v-if="isAudioFile(artifact.source)" viewBox="0 0 88 72"
                    fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 24L40 0V72L16 48H7C3.13401 48 0 44.866 0 41V36V31C0 27.134 3.13401 24 7 24H16Z"
                        fill="black" />
                    <path
                        d="M71.7145 71.8564C81.7224 62.7135 88.0003 49.5561 88.0003 34.9324C88.0003 21.8353 82.9646 9.91431 74.7238 1L69.7461 5.97769C76.1583 13.884 80.0003 23.9596 80.0003 34.9324C80.0003 47.434 75.0132 58.7708 66.9199 67.0619L71.7145 71.8564Z"
                        fill="black" />
                    <path
                        d="M61.5131 60.5592C67.9758 54.3701 72.0001 45.6551 72.0001 36.0002C72.0001 27.4139 68.8173 19.571 63.5672 13.5869L57.8944 19.2597C61.7044 23.7828 64.0001 29.6234 64.0001 36.0002C64.0001 43.446 60.8703 50.1607 55.8545 54.9006L61.5131 60.5592Z"
                        fill="black" />
                    <path
                        d="M50.4646 49.5113C53.8976 45.846 55.9997 40.9187 55.9997 35.5005C55.9997 31.4142 54.8041 27.6072 52.7437 24.4102L46.8649 30.289C47.5934 31.8754 47.9997 33.6405 47.9997 35.5005C47.9997 38.7095 46.7904 41.6361 44.8027 43.8495L50.4646 49.5113Z"
                        fill="black" />
                </svg>
                <video :src="artifact.file" :alt="artifact.id" class="artifact__image--transition" :class="classname"
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
import { isImage, isPdf, isAudioFile, isVideoFile } from '/utils/fileUtils.js';
import { participantAnswer } from '/public/script/participant';
import ExpandButton from './artifact-expand-button.vue';

const props = defineProps({
    questionid: String,
    labels: Object,
})

const emit = defineEmits(['mouseover', 'mouseleave', 'moveup', 'movedown', 'insertAt', 'expand']);

const mouseover = () => emit('mouseover');
const mouseleave = () => emit('mouseleave');

const itemRefs = ref([])

const classname = ref('artifact__image artifact__image--round')

const setRef = (element, index) => itemRefs.value[index] = element

//gets the index at which the new item should be dropped
const getIndex = (refs, cursorX) => {
    for (let i = 0; i < refs.length; i++) {
        const item = refs[i];
        if (!item) continue;
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + (itemRect.width / 2);

        if (cursorX < itemCenter) return i;
    }
    return refs.length;
}

const expand = (source, id) => emit('expand', { source, id })

//used to track where the cursor is placed relatively to the items in the array
const mousemove = (event) => {
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