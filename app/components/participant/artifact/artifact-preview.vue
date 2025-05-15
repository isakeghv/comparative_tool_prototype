<template>
    <div class="artifact__expand" v-if="selectedSource && selectedRawSource">
        <img :src="file" :alt="selectedId" class="artifact__expand--img" v-if="isImage(selectedRawSource)">
        <embed :src="file" class="artifact__expand--embed" v-if="isPdf(selectedRawSource)">
        <audio class="artifact__expand--audio" v-if="isAudioFile(selectedRawSource) && file" controls>
            <source :src="file" type="audio/mpeg">
        </audio>
        <video :src="file" controls class="artifact__expand--video"
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

const file = computed(() =>{ return props.selectedSource})

</script>

<style scoped>
	@import url('public/style/components/study/study-main.scss');
	@import url('public/style/components/participant/participant-question.scss');
</style>