<template>
    <div class="drop_box" @mouseover="mouseover" @mouseleave="mouseleave" @mouseup="mouseup" ref="dropboxRef">
        <p class="drop_text">{{ box }}</p>
        <div class="drop_container">
            <p class="drop__instruction font-small" v-if="!hasArtifact">
                Drag and drop an artifact here
            </p>
            <div class="artifact__container artifact__container--small artifact__borderless">
                <div class="wrapper wrapper--zero" v-if="hasArtifact">
                    <ExpandButton @expand="expand(artifact.source, artifact.id)" />
                </div>
                <img :src="artifact.file" :alt="artifact.id" :class="classname"
                    v-if="hasArtifact && isImage(artifact.source)" />
                <iframe :src="artifact.file" :alt="artifact.id" :class="classname"
                    v-if="hasArtifact && isPdf(artifact.source)"></iframe>
                <svg class="artifact__icon artifact__outline artifact__image--transition"
                    v-if="hasArtifact && isAudioFile(artifact.source)" viewBox="0 0 88 72" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
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
                <video :src="artifact.file" :alt="artifact.id" :class="classname" nu
                    v-if="hasArtifact && isVideoFile(artifact.source)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '/utils/fileUtils.js';
import ExpandButton from './artifact-expand-button.vue';

const props = defineProps({
    artifact: Object,
    box: String,
})

const dropboxRef = ref('');

const classname = ref('artifact__image artifact__image--round')

const hasArtifact = computed(() => {
    return props.artifact && props.artifact.source
})

const emit = defineEmits(['mouseover', 'mouseleave', 'dropped', 'expand'])
 
const mouseover = () => {
    emit('mouseover');
}
const mouseleave = () => {
    emit('mouseleave');
}
const mouseup = () => {
    emit('dropped');
}

const expand = (source, id) => emit('expand', { source, id })

//logic below is for fixing so the drop-box functions on phone (with cursor)
onMounted(()=>{
    const pointerup = (e) =>{

        //gets the x and y position of the pointer
        const x = e.clientX;
        const y = e.clientY;

        //return if the ref is null: avoid issues
        if (!dropboxRef.value) return;

        //get rects of drop-box area
        const rect = dropboxRef.value.getBoundingClientRect();

        //return if rect is null: avoid issues
        if (!rect) return;

        //get dimensions of drop-box
        const top = rect.top;
        const bottom = top + rect.height;
        const left = rect.left;
        const right = left + rect.width;

        //collision detection: to make sure pointer is inside the box
        if (y >= top && y <= bottom && x >= left && x <= right){
            mouseup();
        }
    }

    document.addEventListener('pointerup', pointerup);
})

</script>

<style scoped>
    @import url('public/style/components/study/study-main.scss');
    @import url('public/style/components/participant/participant-question.scss');
</style>