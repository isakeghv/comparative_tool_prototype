<template>
	<section class="question__cont">
		<div class="question__cont--top">
			<div class="question__panel question__panel--left">
				<h2 class="question__headline font-h5 font-semi">{{ currentQuestion.question }}</h2>
				<p class="question__instructions font-body" v-if="instructionText">
					{{ instructionText }}
				</p>
				<div class="question__list">

					<!-- Radio buttons -->
					<label v-if="responseType === 'radio'" v-for="artifact in artifactsArr" :key="artifact.id"
						class="question__option--radio">
						<div class="artifact-container artifact__borderless">
							<input type="radio" :name="currentQuestion.id" :value="artifact.id"
								v-model="selectedArtifact" class="input-overlay" />
							<ArtifactMedia :artifact="artifact" :responseType="responseType" @selectMedia="selectMedia"
								:class="{ 'artifact--selected': participantAnswer[currentQuestion.id]?.includes(artifact.id) }" />
							<div class="wrapper wrapper--zero">
								<ArtifactExpandButton @expand="() => selectMedia(artifact.source, artifact.id)" />
							</div>
						</div>
					</label>

					<!-- Checkbox -->
					<label v-if="responseType === 'checkbox'" v-for="artifact in artifactsArr" :key="artifact.id"
						class="question__options--horizontal">
						<div class="artifact-container artifact__borderless">
							<input type="checkbox" :value="artifact.id"
								:checked="participantAnswer[currentQuestion.id]?.some(item => item.id === artifact.id)"
								@change="toggleCheckbox(currentQuestion.id, artifact.id)" class="input-overlay" />
							<ArtifactMedia :artifact="artifact" :responseType="responseType" @selectMedia="selectMedia"
								:class="{ 'artifact--selected': participantAnswer[currentQuestion.id]?.some(item => item.id === artifact.id) }" />
							<div class="wrapper wrapper--zero">
								<ArtifactExpandButton @expand="() => selectMedia(artifact.source, artifact.id)" />
							</div>
						</div>
					</label>

					<!-- linear -->
					<ArtifactDisplay v-for="artifact in artifactsArr" :key="artifact.id" :responseType="responseType"
						:artifact="artifact" @selectMedia="selectMedia" @moving="(artifact) => linear_moving(artifact)"
						@dropped="linear_drop(currentQuestion.id, currentQuestion.question)"
						v-if="responseType === 'linear'" />

					<!-- drop -->
					<ArtifactDisplay v-for="artifact in artifactsArr" :key="artifact.id" :responseType="responseType"
						:artifact="artifact" @selectMedia="selectMedia" @moving="(artifact) => box_moving(artifact)"
						v-if="responseType === 'drop'" />

					<!-- range -->
					<ArtifactRange v-if="responseType === 'range'" :question-id="currentQuestion.id"
						:artifacts="artifactsArr" @update:responses="val => updateResponses(currentQuestion.id, val)" />

				</div>
			</div>

			<div class="question__panel">
				<ArtifactPreview :selectedSource="selectedSource" :selectedId="selectedId"
					:selectedRawSource="selectedRawSource" />
			</div>
		</div>

		<ArtifactDropLinear @mouseover="linear_artifactOver()" @mouseleave="linear_artifactIsOver = false"
			:artifacts="participantAnswer[currentQuestion.id]" :questionid="currentQuestion.id"
			v-if="responseType === 'linear'" :labels="currentQuestion.linear"
			@moveup="(index) => linear_orderUp(currentQuestion.id, index)"
			@movedown="(index) => linear_orderDown(currentQuestion.id, index)"
			@insertAt="(index) => linear_insertAt = index"
			@expand="(artifact) => selectMedia(artifact.source, artifact.id)" />
		<div v-if="currentQuestion.responseType === 'drop'" class="drop__row">
			<ArtifactDropBox @mouseover="box_mouseover()" @mouseleave="box_mouseleave()"
				@dropped="box_drop(currentQuestion.id, index, box, currentQuestion.question)" :box="box"
				v-if="responseType === 'drop'"
				v-for="(box, index) in currentQuestion.drop.dropBox.filter(box => box !== '')" :key="index"
				:artifact="participantAnswer[currentQuestion.id]?.[index]"
				@expand="(artifact) => selectMedia(artifact.source, artifact.id)" />
		</div>
	</section>
</template>

<script setup>
import ArtifactPreview from './artifact/artifact-preview.vue';
import ArtifactDropLinear from './artifact/artifact-drop-linear.vue';
import ArtifactDropBox from './artifact/artifact-drop-box.vue';
import ArtifactRange from './artifact/artifact-range.vue';
import { linear_moving, linear_artifactIsOver, linear_artifactOver, linear_drop, linear_orderUp, linear_orderDown, linear_insertAt } from './linearFunctionality'
import { box_moving, box_mouseover, box_drop, box_mouseleave } from './dropboxFunctionality'
import { participantAnswer } from '../../public/script/participant';

const props = defineProps({
	questions: Array,
	questionIndex: Number
});

const emit = defineEmits(['validated']);

// ref for 'radio' option
const selectedArtifact = ref('');

// the response type of the question
const currentQuestion = computed(() => props.questions?.[props.questionIndex] ?? {});
const responseType = computed(() => currentQuestion.value?.responseType || '');

// store source and id of image to show it and make it expandable
const selectedSource = ref('');
const selectedRawSource = ref('');
const selectedId = ref('');

const artifactsArr = ref([]);

//randomize the order of the array, so that it is different each time
const randOrder = (arr) => {
	return arr.sort(() => Math.random() - 0.5);
}


const getFile = async (source) => {
	const request = await fetch(`/api/serve-file?filename=${encodeURIComponent(source)}`);
	if (!request.ok) return null;
	const raw = await request.blob();
	return URL.createObjectURL(raw);
}

const selectMedia = async (source, id) => {

	const newSource = await getFile(source);

	if (!newSource) return alert("Sorry, we're experiencing issues fetching the requested data.");

	selectedRawSource.value = source;
	selectedSource.value = newSource;
	selectedId.value = id;
};

const toggleCheckbox = (questionId, artifactId) => {
	const current = participantAnswer[questionId] || [];

	// check if the artifact already exists in the current selection
	const artifactExists = current.some(item => item.id === artifactId);

	if (artifactExists) {
		// remove if unchecked to avoid adding the same artifact
		participantAnswer[questionId] = current.filter(item => item.id !== artifactId);
	} else {
		participantAnswer[questionId] = [...current, { id: artifactId }];
	}
};

// track changes when the index gets updated, and close expanded window of an artifact
watch(() => props.questionIndex, () => {
	selectedSource.value = '';
	selectedId.value = '';
}, { deep: true, immediate: true });

// check if the required question has been answered
const validateRequiredQuestion = () => {
	const isRequired = currentQuestion.value.required;
	let unansweredQuestion = participantAnswer[currentQuestion.value.id];

	// convert to Object.keys() if answers is stored as an object
	if (unansweredQuestion && typeof unansweredQuestion === 'object') {
		unansweredQuestion = Object.keys(unansweredQuestion);
	}

	// if all required answers has been answered, emit to parent to allow to click 'next'
	if (!isRequired || (unansweredQuestion && unansweredQuestion.length > 0) /* && !isInvalid */) {
		emit('validated', true);
	} else {
		emit('validated', false);
	}
};

watch(
	() => participantAnswer[currentQuestion.value.id],
	(newValue) => {
		validateRequiredQuestion();
	},
	{ deep: true, immediate: true }
);

// need to do do the randomization instantely to avoid bug delay
watchEffect(() => {
	if (currentQuestion.value.artifacts) {
		artifactsArr.value = randOrder([...currentQuestion.value.artifacts]);
	}
});

watch(selectedArtifact, (newValue) => {
	if (newValue) {
		participantAnswer[currentQuestion.value.id] = [{ id: newValue }];
	} else {
		participantAnswer[currentQuestion.value.id] = [];
	}
});

// instructions to different question types
const instructionText = computed(() => {
	switch (responseType.value) {
		case 'radio':
			return 'Select one of the artifacts by clicking on it.';
		case 'checkbox':
			return 'Select one or more artifacts by checking the boxes.';
		case 'linear':
			return 'Drag and drop the artifacts to rank them in order.';
		case 'drop':
			return 'Drag the artifacts into the boxes where you believe they belong.';
		case 'range':
			return 'Adjust the slider to reflect your rating about the artifact.';
		default:
			return '';
	}
});


</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
@import url('public/style/components/participant/participant-question.scss');
</style>