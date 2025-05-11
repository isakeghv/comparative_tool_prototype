<template>
	<main class="participant__cont participant__cont--intro">
	<h2 class="participant__title font-h4 font-semi">{{ study.title }}</h2>

		<!-- should check if description is empty -->
		<section class="participant__section">
			<p class="participant__desc">{{ study.description }}</p>
		</section>

		<section class="participant__section participant__desc">
			<div class="terms__cont">

				<!-- The "I agree" checkbox -->
				<input type="checkbox" id="terms__checkbox" class="terms__checkbox" v-model="isChecked" />
				<label for="terms__checkbox" class="terms__label font-small">
					By participating, you confirm that you have read, understood, and agree to our 
					<a href="#" @click.prevent="togglePopup" class="terms__link font-small">User Agreement</a>.
				</label>

				<!-- The popup shown when clicking the link -->
				<div class="terms__popup" v-if="showPopup">
					<button class="terms__button terms__button--close" @click="showPopup = false">
						<svg xmlns="http://www.w3.org/2000/svg" class="terms__cross" viewBox="0 -960 960 960" width="24px">
							<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
						</svg>
					</button>
					<div class="terms__text">
						<h3 class="participant__sub font-h5">User Agreement</h3>
						
						<!-- Default Terms (always shown) -->
						<p class="font-small">
							This study collects your IP address. All data is anonymized and securely stored.
						</p>

						<!-- Custom Terms -->
						<p v-if="study.customTerms.request" class="font-small" style="margin-top: 1rem;">
							{{ study.customTerms.terms }}
						</p>
					</div>
				</div>
			</div>
		</section>

		<div>
			<!-- <button @click="handleStart" :disabled="!isChecked" class="participant__button participant__button--start font-small font-semi">Start</button> -->
			<button @click="handleStart" :disabled="!isChecked && study.customTerms.request" class="participant__button participant__button--start font-small font-semi" id="participant-start-btn">Start</button>
			<div v-if="showPopup" class="overlay" @click="showPopup = false"></div>
		</div>
	</main>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
	study: Object,
	handleStart: Function
});

// variable to disable the start button if the terms haven't been checked
const isChecked = ref(false);
const showPopup = ref(false);
// toggle showing terms when clicking on the link
const togglePopup = () => {
	showPopup.value = !showPopup.value;
};

</script>

<style scoped>
@import url('public/style/pages/participant/participant.scss');
</style>
