<template>
	<div class="participant__cont--alt">
		<div class="participant__center">
			<section v-if="study?.demographicReq" class="participant__section">
				<h2 class="participant__headline font-h5 font-semi">Demographics</h2>
				<p>{{ study.demographics }}</p>

				<div v-for="question in questions">
					<div v-if="question.request" class="participant__box">
						<h3 class="participant__sub font-large font-medium">{{ formatQuestion(question.question) }} <span v-if="question.required">*</span></h3>
						<component :is="getResponseComponent(question.responseType)" :question="question"/>
					</div>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup>
import DemographicRadio from '~/components/participant/demographic/demographic-radio.vue';
import DemographicText from '~/components/participant/demographic/demographic-text.vue';
import DemographicNumber from '~/components/participant/demographic/demographic-number.vue';
import DemographicDate from '~/components/participant/demographic/demographic-date.vue';

const props = defineProps({
	study: Object
});

//formats question, so that it asks "your..." instead of "request...."
const formatQuestion = (question) =>{
	return question.replace('Request', 'Your');
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