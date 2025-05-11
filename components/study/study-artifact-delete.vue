<template>
    <button class="wrapper__button wrapper__button--radius" @click="deleteArtifact()">
        <svg class="wrapper__icon" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="path-1-inside-1_0_1" fill="white">
                <path d="M2 3H13V18H2V3Z" />
            </mask>
            <path d="M2 3H13V18H2V3Z" fill="white" />
            <path d="M13 18V19H14V18H13ZM2 18H1V19H2V18ZM12 3V18H14V3H12ZM13 17H2V19H13V17ZM3 18V3H1V18H3Z"
                fill="#444444" mask="url(#path-1-inside-1_0_1)" />
            <line y1="2.5" x2="15" y2="2.5" stroke="#444444" />
            <mask id="path-4-inside-2_0_1" fill="white">
                <path d="M4 0H11V3H4V0Z" />
            </mask>
            <path d="M4 0V-1H3V0H4ZM11 0H12V-1H11V0ZM4 1H11V-1H4V1ZM10 0V3H12V0H10ZM5 3V0H3V3H5Z" fill="#444444"
                mask="url(#path-4-inside-2_0_1)" />
        </svg>
    </button>

</template>

<script setup>
import { study } from '~/public/script/reactive';
const props = defineProps({
    artifact: Object,
    questionID: String,
})

const deleteArtifact = () => {
    //finds the relevant study in the questions array
    const studyArtifact = study.questions
        .map(q => q.artifacts.find(a => a.id === props.artifact.id))
        .find(a => a !== undefined);

    //returning if not found or not similar to current artifact
    if (!studyArtifact && JSON.stringify(props.artifact) !== JSON.stringify(studyArtifact)) return alert('Unable to delete artifact. Please save, exit and try again');

    //gets the index of the relevant question and artifact in that question
    const qIndex = study.questions.findIndex(q => q.id === props.questionID);
    const aIndex = study.questions[qIndex].artifacts.findIndex(a => a.id === props.artifact.id);

    //removes the artifact from the array displayed for this question
    if (aIndex !== -1) study.questions[qIndex].artifacts.splice(aIndex, 1);
}

</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
@import url('public/style/components/study/study-aside.scss');
</style>