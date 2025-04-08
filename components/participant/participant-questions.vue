<template>
	<section class="question__cont">
		<div class="question__cont--top">
			<div class="question__panel question__panel--left">
				<h2 class="question__headline font-h5 font-semi">{{ currentQuestion.question }}</h2>
				<div class="question__list">
					<ArtifactDisplay v-for="artifact in artifactsArr" :key="artifact.id" :responseType="responseType"
						:artifact="artifact" @selectMedia="selectMedia" @moving="(artifact) => linear_moving(artifact)"
						@dropped="linear_drop(currentQuestion.id)" v-if="responseType === 'linear'" />

					<ArtifactDisplay v-for="artifact in artifactsArr" :key="artifact.id" :responseType="responseType"
						:artifact="artifact" @selectMedia="selectMedia" @moving="(artifact) => box_moving(artifact)"
						v-if="responseType === 'drop'" />
				</div>
			</div>

			<div class="question__panel">
				<ArtifactPreview :selectedSource="selectedSource" :selectedId="selectedId" />
			</div>
		</div>

		<ArtifactDropLinear @mouseover="linear_artifactOver()" @mouseleave="linear_artifactIsOver = false"
			:artifacts="participantAnswer[currentQuestion.id]" :questionid="currentQuestion.id"
			v-if="responseType === 'linear'" :labels="currentQuestion.linear"
			@moveup="(index) => linear_orderUp(currentQuestion.id, index)"
			@movedown="(index) => linear_orderDown(currentQuestion.id, index)" @insertAt="(index) => linear_insertAt = index"/>
		<div class="drop__row">
			<ArtifactDropBox @mouseover="box_mouseover()" @mouseleave="box_mouseleave()"
				@dropped="box_drop(currentQuestion.id, index, box)" :box="box" v-if="responseType === 'drop'"
				v-for="(box, index) in currentQuestion.drop.dropBox" :key="index"
				:artifact="participantAnswer[currentQuestion.id]?.[index]"
				@expand="(artifact) => selectMedia(artifact.source, artifact.id)" />
		</div>
	</section>
</template>

<script setup>
import ArtifactPreview from './artifact/artifact-preview.vue';
import ArtifactDropLinear from './artifact/artifact-drop-linear.vue';
import ArtifactDropBox from './artifact/artifact-drop-box.vue';
import { linear_moving, linear_artifactIsOver, linear_artifactOver, linear_drop, linear_orderUp, linear_orderDown, linear_insertAt } from './linearFunctionality'
import { box_moving, box_mouseover, box_drop, box_mouseleave } from './dropboxFunctionality'
import { participantAnswer } from '~/public/script/participant';

const props = defineProps({
	questions: Array,
	questionIndex: Number
});

// the response type of the question
const currentQuestion = computed(() => props.questions?.[props.questionIndex] ?? {});
const responseType = computed(() => currentQuestion.value?.responseType || '');

// store source and id of image to show it and make it expandable
const selectedSource = ref('');
const selectedId = ref('');

//randomize the order of the array, so that it is different each time
const randOrder = (arr) => {
	return arr.sort(() => Math.random() - 0.5);
}

const artifactsArr = computed(() => {
	return randOrder(currentQuestion.value.artifacts)
})


const selectMedia = (source, id) => {
	selectedSource.value = source;
	selectedId.value = id;
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
