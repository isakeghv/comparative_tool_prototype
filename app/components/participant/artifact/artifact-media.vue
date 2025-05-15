<template>
    <div class="artifact__media" v-if="artifact" :draggable="false">
        <img :src="filePath" :alt="artifact.id" class="artifact__image artifact__border" v-if="isImage(artifact.source)"
            draggable="false">
        <svg class="artifact__icon artifact__border" v-if="isAudioFile(artifact.source)" viewBox="0 0 88 72" fill="none"
            xmlns="http://www.w3.org/2000/svg" draggable="false">
            <path d="M16 24L40 0V72L16 48H7C3.13401 48 0 44.866 0 41V36V31C0 27.134 3.13401 24 7 24H16Z" fill="black" />
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
        <div v-if="isPdf(artifact.source)" class="artifact__iframecontainer" draggable="false">
            <iframe :src="filePath" class="artifact__embed artifact__border" type="application/pdf"
                draggable="false"></iframe>
            <div class="artifact__cover" draggable="false"></div>
        </div>
        <div class="artifact__videocontainer" v-if="isVideoFile(artifact.source)">
            <video :src="filePath" class="artifact__video artifact__border" preload="metadata" muted
            v-if="isVideoFile(artifact.source)" draggable="false"></video>
        </div>
    </div>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '~/utils/fileUtils.js';

const props = defineProps({
    artifact: Object,
})

const filePath = ref('');

const getFile = async () => {
    const request = await fetch(`/api/serve-file?filename=${encodeURIComponent(props.artifact.source)}`);

    if (!request.ok) return null;

    const raw = await request.blob();

    return URL.createObjectURL(raw);
}

onMounted(async () => {
    const fileurl = await getFile();

    if (!fileurl) filePath.value = '';

    filePath.value = `${fileurl}`;
})

</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
@import url('public/style/components/participant/participant-question.scss');
</style>