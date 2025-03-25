<template>
	<section class="question">
		<h2 class="participant__title font-h5 font-medium">{{ currentQuestion.question }}</h2>
		{{  responseType }}

		<div v-if="responseType === 'checkbox'">
			{{ currentQuestion.checkbox }}
		</div>

		<div v-if="responseType === 'range'">
			{{ currentQuestion.range }}
		</div>

		<div v-if="responseType === 'linear'">
			{{ currentQuestion.linear }}
		</div>

		<div v-if="responseType === 'drop'">
			{{ currentQuestion.range }}
		</div>


		<div v-for="artifact in currentQuestion.artifacts" :key="artifact.id" @click="selectMedia(artifact.source, artifact.id)" class="artifact__container artifact__borderless">
			<div class="wrapper">
				<button class="wrapper__button wrapper__button--radius" @click="selectMedia(artifact.source, artifact.id)">
					<svg class="wrapper__icon" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M13.1899 7.99435C12.9946 8.18961 12.9946 8.50619 13.1899 8.70145C13.3852 8.89672 13.7017 8.89672 13.897 8.70145L13.1899 7.99435ZM21.3914 0.999988C21.3914 0.723846 21.1675 0.499988 20.8914 0.499988L16.3914 0.499989C16.1152 0.499989 15.8914 0.723846 15.8914 0.999989C15.8914 1.27613 16.1152 1.49999 16.3914 1.49999L20.3914 1.49999L20.3914 5.49999C20.3914 5.77613 20.6152 5.99999 20.8914 5.99999C21.1675 5.99999 21.3914 5.77613 21.3914 5.49999L21.3914 0.999988ZM13.897 8.70145L21.2449 1.35354L20.5378 0.646435L13.1899 7.99435L13.897 8.70145Z"
							fill="#444444" />
						<path
							d="M13.1899 13.8968C12.9946 13.7015 12.9946 13.3849 13.1899 13.1897C13.3852 12.9944 13.7017 12.9944 13.897 13.1897L13.1899 13.8968ZM21.3914 20.8911C21.3914 21.1673 21.1675 21.3911 20.8914 21.3911L16.3914 21.3911C16.1152 21.3911 15.8914 21.1673 15.8914 20.8911C15.8914 20.615 16.1152 20.3911 16.3914 20.3911L20.3914 20.3911L20.3914 16.3911C20.3914 16.115 20.6152 15.8911 20.8914 15.8911C21.1675 15.8911 21.3914 16.115 21.3914 16.3911L21.3914 20.8911ZM13.897 13.1897L21.2449 20.5376L20.5378 21.2447L13.1899 13.8968L13.897 13.1897Z"
							fill="#444444" />
						<path
							d="M8.7017 13.8968C8.89696 13.7015 8.89696 13.3849 8.7017 13.1897C8.50644 12.9944 8.18985 12.9944 7.99459 13.1897L8.7017 13.8968ZM0.500232 20.8911C0.500233 21.1673 0.72409 21.3911 1.00023 21.3911L5.50023 21.3911C5.77638 21.3911 6.00023 21.1673 6.00023 20.8911C6.00023 20.615 5.77637 20.3911 5.50023 20.3911L1.50023 20.3911L1.50023 16.3911C1.50023 16.115 1.27638 15.8911 1.00023 15.8911C0.72409 15.8911 0.500233 16.115 0.500233 16.3911L0.500232 20.8911ZM7.99459 13.1897L0.646679 20.5376L1.35379 21.2447L8.7017 13.8968L7.99459 13.1897Z"
							fill="#444444" />
						<path
							d="M8.7017 7.99435C8.89696 8.18961 8.89696 8.50619 8.7017 8.70145C8.50644 8.89672 8.18985 8.89672 7.99459 8.70145L8.7017 7.99435ZM0.500232 0.999988C0.500233 0.723846 0.72409 0.499988 1.00023 0.499988L5.50023 0.499989C5.77638 0.499989 6.00023 0.723846 6.00023 0.999989C6.00023 1.27613 5.77637 1.49999 5.50023 1.49999L1.50023 1.49999L1.50023 5.49999C1.50023 5.77613 1.27638 5.99999 1.00023 5.99999C0.72409 5.99999 0.500233 5.77613 0.500233 5.49999L0.500232 0.999988ZM7.99459 8.70145L0.646679 1.35354L1.35379 0.646435L8.7017 7.99435L7.99459 8.70145Z"
							fill="#444444" />
					</svg>
				</button>
			</div>
				
			<img :src="artifact.source" :alt="artifact.id" class="artifact__image artifact__border" v-if="isImage(artifact.source)">
			<svg class="artifact__icon artifact__border" v-if="isAudioFile(artifact.source)" viewBox="0 0 88 72" fill="none"
				xmlns="http://www.w3.org/2000/svg">
				<path d="M16 24L40 0V72L16 48H7C3.13401 48 0 44.866 0 41V36V31C0 27.134 3.13401 24 7 24H16Z"
					fill="black" />
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
			<embed :src="artifact.source" class="artifact__image artifact__border" type="application/pdf" v-if="isPdf(artifact.source)">
			<video :src="artifact.source" class="artifact__video artifact__border" preload="metadata" muted v-if="isVideoFile(artifact.source)"></video>
			<!-- {{ artifact.id }} -->
		</div>

		<button class="overlay" v-if="selectedSource" @click="selectedSource = ''" aria-label="exit window"></button>
        <div class="expand" v-if="selectedSource">
            <button class="expand__button" @click="selectedSource = ''">Exit</button>
            <img :src="selectedSource" :alt="selectedId" class="expand__img" v-if="isImage(selectedSource)">
            <embed :src="selectedSource" class="expand__embed" v-if="isPdf(selectedSource)">
            <audio class="expand__audio" v-if="isAudioFile(selectedSource)" controls>
                <source :src="selectedSource" type="audio/mpeg">
            </audio>
            <video :src="selectedSource" controls class="expand__img" v-if="isVideoFile(selectedSource)"></video>
        </div>
	</section>
</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '@/server/utils/fileUtils.js';

const props = defineProps({
	questions: Array,
	questionIndex: Number
});

// access the question at a specific index
const currentQuestion = computed(() => props.questions[props.questionIndex] || {});

// the response type of the question
const responseType = computed(() => currentQuestion.value?.responseType || '');

// store source and id of image to show it and make it expandable
const selectedSource = ref('');
const selectedId = ref('');

const selectMedia = (source, id) => {
    selectedSource.value = source;
    selectedId.value = id;
};

// track changes when the index gets updated
watch(() => props.questionIndex, () => {
}, { deep: true, immediate: true });
</script>

<style scoped>
    @import url('public/style/components/participant/participant-question.scss');
	@import url('public/style/components/study/study-main.scss');
</style>
