<template>
	<div class="participant__cont--alt">
		<div class="participant__center">
			<section v-if="study?.demographicReq" class="participant__section">
				<h2 class="participant__headline font-h5 font-semi">Demographics</h2>
				<p>{{ study.demographics }}</p>

				
				<div v-for="question in questions">
					<div v-if="question.request" class="participant__box">
						<h3 class="participant__sub font-normal font-medium">{{ formatQuestion(question.question) }} <span v-if="question.required">*</span></h3>
						<component :is="getResponseComponent(question.responseType)" :question="question" @update="(response) => updateDemographics(question.id, question.question, response)"/>
					</div>
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
import { participantAnswer } from '~/public/script/participant';

const props = defineProps({
	study: Object
});

//formats question, so that it asks "your..." instead of "request...."
const formatQuestion = (question) =>{
	return question.replace('Request', 'Your');
}

//making sure that the demographics exists and is an object
if (!participantAnswer.demographic) participantAnswer.demographic = [];

//updating the participant response in reactive variable
const updateDemographics = (id, question, res) =>{
	const demographic = participantAnswer.demographic;

	if (!demographic[id]) demographic[id] = {};
	if (!demographic[id].question) demographic[id].question = question;
	demographic[id].response = res
}

// store the demographic array
const questions = computed(() => props.study.demographic);

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

</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
