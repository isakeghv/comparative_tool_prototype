<template>
    <!-- how the base question is structured -->
    <div class="responses__cont">
        <h2 class="font-h5 font-medium">{{ question.question }}</h2>
        <div>{{ answers }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    question: Object,
    answers: Array
});
</script>

<style scoped>
    @import url('public/style/components/responses/responses-template.scss');
</style>
    

<!-- <label v-if="responseType === 'radio'" v-for="artifact in artifactsArr" :key="artifact.id" class="question__option--radio">
    <div class="artifact-container artifact__borderless">
        <input type="radio" :name="currentQuestion.id" :value="artifact.id" v-model="selectedArtifact"
                class="input-overlay"/>
        <ArtifactMedia :artifact="artifact" :responseType="responseType" @selectMedia="selectMedia" :class="{ 'artifact--selected': participantAnswer[currentQuestion.id]?.includes(artifact.id) }"/>
        <div class="wrapper wrapper--zero">
            <ArtifactExpandButton @expand="() => selectMedia(artifact.source, artifact.id)" />
        </div>
    </div>
</label> -->
