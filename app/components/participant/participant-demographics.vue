<template>
	<div class="participant__cont--alt">
		<div class="participant__center">
			<section v-if="study?.demographicReq" class="participant__section">
				<h2 class="participant__headline font-h5 font-semi">Demographics</h2>

				<div v-for="question in questions" class="participant__box">
					<h3 class="participant__sub font-large font-medium">{{ formatQuestion(question.question) }} <span v-if="question.required">*</span></h3>
					<component 
						:is="getResponseComponent(question.responseType)"
						:question="question"
						:value="participantAnswer.demographic[question.id]"
						@update="(response) => updateDemographics(question.id, response)"
					/>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup>
import DemographicRadio from './demographic/demographic-radio.vue';
import DemographicText from './demographic/demographic-text.vue';
import DemographicNumber from './demographic/demographic-number.vue';
import DemographicDate from './demographic/demographic-date.vue';
import { participantAnswer } from '../../public/script/participant';
import { computed } from 'vue';

const props = defineProps({
	study: Object
});

const invalidMap = ref({});

const emit = defineEmits(['validated']);

// store the demographic array that has been requested
const questions = computed(() => {
  return props.study.demographic?.filter(q => q.request);
});

//formats question, so that it asks "your..." instead of "request...."
const formatQuestion = (question) =>{
	return question.replace('Request', 'Your');
}

// //making sure that the demographics exists and is an array
// if (!participantAnswer.demographic) participantAnswer.demographic = [];

//updating the participant response in reactive variable
if (!participantAnswer.demographic) participantAnswer.demographic = {};

const updateDemographics = (id, res) => {
	const demographic = participantAnswer.demographic;

	// set an object with id
	if (!demographic[id]) demographic[id] = {};

	// only store answer response
	demographic[id] = res.val;
	invalidMap.value[id] = res.isInvalid;
}

// function that returns component depending on the response type of the current demographic question
const getResponseComponent = (responseType) => {
	const map = {
		radio: DemographicRadio,
		text: DemographicText,
		number: DemographicNumber,
		date: DemographicDate,
	};

	return map[responseType]
};

const validateDemographics = () => {
	// filter the required questions, and keep track of questions that haven't been answered
	const requiredQuestions = questions.value.filter(q => q.required);
	const unansweredQuestions = requiredQuestions.filter(q => !participantAnswer.demographic[q.id]);
	const isInvalid = Object.values(invalidMap.value).some(v => v);

	// if all required answers has been answered, emit to parent to allow to click 'next'
	if (unansweredQuestions.length === 0 && !isInvalid) {
		emit('validated', true);
	} else {
		emit('validated', false);
	}
};

watch(
	() => participantAnswer.demographic,
	(newValue) => {
		validateDemographics();
	},
	{ deep: true }
);
</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
