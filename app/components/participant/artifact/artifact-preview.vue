<template>
    <div class="artifact__expand" v-if="selectedSource && selectedRawSource">
        <div v-if="!file" class="artifact__expand--image"></div>
        <img :src="file" :alt="selectedId" class="artifact__expand--img" v-else-if="isImage(selectedRawSource)">
        <iframe :src="file" class="artifact__expand--embed" v-else-if="isPdf(selectedRawSource)"></iframe>
        <audio class="artifact__expand--audio" v-else-if="isAudioFile(selectedRawSource) && file" controls>
            <source :src="file" type="audio/mpeg">
        </audio>
        <video :src="file" controls class="artifact__expand--video"
            v-else-if="isVideoFile(selectedRawSource)"></video>
    </div>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '/utils/fileUtils.js';

const props = defineProps({
    selectedSource: String,
    selectedId: String,
    selectedRawSource: String
})

const file = computed(() =>{ return props.selectedSource})

</script>

<style scoped>
	@import url('public/style/components/study/study-main.scss');
	@import url('public/style/components/participant/participant-question.scss');
</style>