<template>
    <div class="question__cont--btm drop_zone">
        <div class="drop_container drop_container--linear" @mouseover="mouseover" @mouseleave="mouseleave">
            <div v-for="artifact in artifacts" :key="artifact.id"
            class="artifact__container artifact__container--small artifact__borderless">
            <img :src="artifact.source" :alt="artifact.id" class="artifact__image" v-if="isImage(artifact.source)" />
            <embed :src="artifact.source" :alt="artifact.id" class="artifact__image" v-if="isPdf(artifact.source)" />
            <audio :src="artifact.source" :alt="artifact.id" class="artifact__image"
                v-if="isAudioFile(artifact.source)" />
            <video :src="artifact.source" :alt="artifact.id" class="artifact__image"
                v-if="isVideoFile(artifact.source)" />
        </div>
        </div>
    </div>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '~/utils/fileUtils.js';

const props = defineProps({
    artifacts: Array
})

const emit = defineEmits(['mouseover', 'mouseleave'])

const mouseover = () => emit('mouseover');
const mouseleave = () => emit('mouseleave')

</script>

<style scoped>
	@import url('public/style/components/study/study-main.scss');
	@import url('public/style/components/participant/participant-question.scss');
</style>