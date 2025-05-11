<template>
    <div class="drop_box" @mouseover="mouseover" @mouseleave="mouseleave" @mouseup="mouseup">
        <p class="drop_text">{{ box }}</p>
        <div class="drop_container">
            <div class="artifact__container artifact__container--small artifact__borderless">
                <div class="wrapper wrapper--zero" v-if="hasArtifact">
                    <ExpandButton @expand="expand(artifact.source, artifact.id)" />
                </div>
                <img :src="artifact.source" :alt="artifact.id" :class="classname"
                    v-if="hasArtifact && isImage(artifact.source)" />
                <embed :src="artifact.source" :alt="artifact.id" :class="classname"
                    v-if="hasArtifact && isPdf(artifact.source)" />
                <audio :src="artifact.source" :alt="artifact.id" :class="classname"
                    v-if="hasArtifact && isAudioFile(artifact.source)" />
                <video :src="artifact" :alt="artifact.id" :class="classname"nu
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

const classname = ref('artifact__image artifact__image--round')

const hasArtifact = computed(() => {
    return props.artifact && props.artifact.source
})

const emit = defineEmits(['mouseover', 'mouseleave', 'dropped', 'expand'])

const mouseover = () => emit('mouseover');
const mouseleave = () => emit('mouseleave');
const mouseup = () => emit('dropped');
const expand = (source, id) => emit('expand', { source, id })

</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
@import url('public/style/components/participant/participant-question.scss');
</style>