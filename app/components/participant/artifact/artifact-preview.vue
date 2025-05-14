<template>
    <div class="artifact__expand" v-if="selectedSource">
        <img :src="selectedSource" :alt="selectedId" class="artifact__expand--img" v-if="isImage(selectedRawSource)">
        <embed :src="selectedSource" class="artifact__expand--embed" v-if="isPdf(selectedRawSource)">
        <audio class="artifact__expand--audio" v-if="isAudioFile(selectedRawSource)" controls>
            <source :src="selectedSource" type="audio/mpeg">
        </audio>
        <video :src="selectedSource" controls class="artifact__expand--video"
            v-if="isVideoFile(selectedRawSource)"></video>
    </div>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '/utils/fileUtils.js';

const props = defineProps({
    selectedSource: String,
    selectedId: String,
    selectedRawSource: String
})

console.log(props.selectedSource)

</script>

<style scoped>
	@import url('public/style/components/study/study-main.scss');
	@import url('public/style/components/participant/participant-question.scss');
</style>