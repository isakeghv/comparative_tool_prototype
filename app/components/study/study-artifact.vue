<template>
    <div class="center">
        <img v-if="isImage(source)" :src="filePath" :alt="id" :class="{ 'artifact__round': isRounded }"
            class="artifact__image" />
        <svg v-else-if="isAudioFile(source)" class="artifact__icon" :class="{ 'artifact__round': isRounded }"
            viewBox="0 0 88 72" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <embed v-else-if="isPdf(source)" :src="source" class="artifact__embed articfact__embed--hoverable"
            :class="{ 'artifact__round': isRounded }" type="application/pdf" />
        <svg v-else-if="isVideoFile(source)" class="artifact__icon" :class="{ 'artifact__round': isRounded }"
            viewBox="0 0 287 287" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="143.5" cy="143.5" r="134" stroke="black" stroke-width="19" />
            <path d="M219.25 143.581L97 214.162L97 73L219.25 143.581Z" fill="black" />
        </svg>

    </div>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '~/utils/fileUtils.js';

const props = defineProps({
    source: String,
    id: String,
    isRounded: Boolean
});

const filePath = ref('');

const getFile = async () => {
    const request = await fetch(`/api/serve-file?filename=${encodeURIComponent(props.source)}`);

    if (!request.ok) return null;

    const raw = await request.blob();

    return URL.createObjectURL(raw);
}

onMounted(async () => {
    const fileurl = await getFile();

    if (!fileurl) filePath.value = '';

    filePath.value = `${fileurl}`;
})

onBeforeUnmount(() => {
  if (filePath.value) {
    URL.revokeObjectURL(filePath.value);
  }
});
</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
</style>