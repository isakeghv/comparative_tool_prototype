<template>
	<div v-for="(artifact, index) in artifacts" :key="artifact.id" class="artifact-range range-slider">
		<div class="artifact-container artifact__borderless">
			<ArtifactMedia :artifact="artifact" responseType="range"
				@selectMedia="() => $emit('selectMedia', artifact.source, artifact.id)" />
			<div class="wrapper wrapper--zero">
				<ArtifactExpandButton @expand="() => $emit('selectMedia', artifact.source, artifact.id)" />
			</div>
		</div>

		<span class="number">{{
			participantAnswer[question.id]?.find(a => a.id === artifact.id)?.value ||
			responses[index]?.value}}
		</span>
		<div class="column">
			<span v-if="question.range.startLabel || question.range.endLabel" class="instructions">
				<span class="label" v-if="question.range.startLabel">{{ rangeLabels[0] }}</span>
				<span class="label" v-if="question.range.endLabel">{{ rangeLabels[1] }}</span>
			</span>
			<div>
				<label :for="`artifact-range-${index}`" class="hide">
					{{ responses[index]?.value }}
				</label>

				<input type="range" ß :id="`artifact-range-${index}`" :min="rangeMin" :max="rangeMax"
					v-model.number="responses[index].value" @input="emitResponse(index)" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { participantAnswer } from '~/public/script/participant';

const props = defineProps({
	question: Object,
	artifacts: Array,
});

const emit = defineEmits(['update:responses', 'selectMedia']);

const rangeMin = computed(() => Number(props.question?.range?.min) || 0);
const rangeMax = computed(() => Number(props.question?.range?.max) || 100);

const rangeLabels = computed(() => {
	const start = props.question?.range?.startLabel ?? '';
	const end = props.question?.range?.endLabel ?? '';
	return [start, end];
});

// Initialize responses array as { id, value } pairs
const responses = ref([]);

watch(
	() => props.artifacts,
	(newArtifacts) => {
		responses.value = newArtifacts.map((artifact) => {
			const existing = participantAnswer[props.question.id]?.find(a => a.id === artifact.id);
			return {
				id: artifact.id,
				value: existing?.value ?? rangeMin.value
			};
		});
		emit('update:responses', [...responses.value]);
	},
	{ immediate: true }
);

const emitResponse = () => {
	emit('update:responses', [...responses.value]);
};
</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
@import url('public/style/components/participant/participant-question.scss');

.column {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 40rem;
	margin: 0 0.8rem;
	justify-content: center;
}

.instructions {
	display: flex;
	padding-bottom: 0.4rem;
	justify-content: space-between;
}

.label {
	display: block;
	font-weight: 600;
	color: gray;
}

.number {
	min-width: 3ch;
}
</style>