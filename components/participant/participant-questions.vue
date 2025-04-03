<template>
	<section class="question__cont">
		<!-- dynamically render a component based on its response type-->
		<component :is="responseComponent" :question="currentQuestion">
			<template #left>
				<ArtifactDisplay :artifacts="currentQuestion.artifacts" :haveDraggable="true" @selectMedia="selectMedia" />
			</template>

			<template #right>
				<div class="artifact__expand" v-if="selectedSource">
					<img :src="selectedSource" :alt="selectedId" class="artifact__expand--img" v-if="isImage(selectedSource)">
					<embed :src="selectedSource" class="artifact__expand--embed" v-if="isPdf(selectedSource)">
					<audio class="artifact__expand--audio" v-if="isAudioFile(selectedSource)" controls>
						<source :src="selectedSource" type="audio/mpeg">
					</audio>
					<video :src="selectedSource" controls class="artifact__expand--video" v-if="isVideoFile(selectedSource)"></video>
				</div>
			</template>

			<template #drop-zone>
				<div class="question__cont--btm drop_zone"
					@drop="onDrop($event, 1)"
					@dragover.prevent
					@dragenter.prevent>

					<div v-for="artifact in droppedArtifacts" :key="artifact.id" class="artifact__container artifact__container--small artifact__borderless">
						<img :src="artifact.source" :alt="artifact.id" class="artifact__image" v-if="isImage(artifact.source)" />
						<embed :src="artifact.source" :alt="artifact.id" class="artifact__image" v-if="isPdf(artifact.source)" />
						<audio :src="artifact.source" :alt="artifact.id" class="artifact__image" v-if="isAudioFile(artifact.source)" />
						<video :src="artifact.source" :alt="artifact.id" class="artifact__image" v-if="isVideoFile(artifact.source)" />						
					</div>
				</div>
			</template>

			<!-- if the response type doesn't use a side panel, slot in the default version -->
			<template #default>
				<ArtifactDisplay :artifacts="currentQuestion.artifacts" @selectMedia="selectMedia" :haveDraggable="false" />
				<div class="expand" v-if="selectedSource">
					<button class="expand__button" @click="selectedSource = ''">Exit</button>
					<img :src="selectedSource" :alt="selectedId" class="expand__img" v-if="isImage(selectedSource)">
					<embed :src="selectedSource" class="expand__embed" v-if="isPdf(selectedSource)">
					<audio class="expand__audio" v-if="isAudioFile(selectedSource)" controls>
						<source :src="selectedSource" type="audio/mpeg">
					</audio>
					<video :src="selectedSource" controls class="expand__img" v-if="isVideoFile(selectedSource)"></video>
				</div>
			</template>
		</component>
	</section>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '~/utils/fileUtils.js';
import ArtifactSelection from './artifact/artifact-selection.vue';
import ArtifactRange from './artifact/artifact-range.vue';
import ArtifactLinear from './artifact/artifact-linear.vue';
import ArtifactDrop from './artifact/artifact-drop.vue';

const props = defineProps({
	questions: Array,
	questionIndex: Number
});

// ref of artifacts dropped in drop zone
const droppedArtifacts = ref([]);

// the response type of the question
const currentQuestion = computed(() => props.questions?.[props.questionIndex] ?? {});
const responseType = computed(() => currentQuestion.value?.responseType || '');

// store source and id of image to show it and make it expandable
const selectedSource = ref('');
const selectedId = ref('');

const selectMedia = (source, id) => {
    selectedSource.value = source;
    selectedId.value = id;
};

// return component depending on the response type of the current question
const responseComponent = computed(() => {
	const map = {
		radio: ArtifactSelection,
		checkbox: ArtifactSelection,
		range: ArtifactRange,
		drop: ArtifactDrop,
		linear: ArtifactLinear
	};

	return map[responseType.value]
});


const onDrop = (e) => {
	const artifactId = e.dataTransfer.getData('artifactId');
    const artifactSource = e.dataTransfer.getData('artifactSource');

    const draggedArtifact = { id: artifactId, source: artifactSource };

	// don't push artifacts that already exist in the drop zone (prevent duplication)
    if (!droppedArtifacts.value.some(artifact => artifact.id === artifactId)) {
        droppedArtifacts.value.push(draggedArtifact);
    }

	// console.log(artifactSource);
	// console.log(artifactId);
};

// track changes when the index gets updated, and close expanded window of an artifact
watch(() => props.questionIndex, () => {
	selectedSource.value = '';
    selectedId.value = '';
}, { deep: true, immediate: true });

</script>

<style scoped>
	@import url('public/style/components/study/study-main.scss');
	@import url('public/style/components/participant/participant-question.scss');
</style>
