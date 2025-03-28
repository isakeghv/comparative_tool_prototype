<template>
	<div class="participant__start">
	<h2 class="participant__headline font-h4 font-semi">{{ study.title }}</h2>

		<!-- should check if description is empty -->
		<section class="participant__section">
			<p class="participant__desc">{{ study.description }}</p>
		</section>

		<section v-if="study.customTerms.request" class="participant__section participant__desc">
			<div class="terms__cont">
				<input type="checkbox" id="terms__checkbox" class="terms__checkbox" v-model="isChecked" />
				<label for="terms__checkbox" class="terms__label font-small">
					By participating, you confirm that you have read, understood, and agree to our 
				<a href="#" @click.prevent="togglePopup" class="terms__link font-small">Terms of Service</a> and
				<a href="#" @click.prevent="togglePopup" class="terms__link font-small">Privacy Policy</a>.
				</label>

				<div class="terms__popup" v-if="showPopup">
					<p>{{ study.customTerms.terms }}</p>
				</div>

			</div>

		</section>
		<div>
			<button @click="handleStart" :disabled="!isChecked">Start</button>
		</div>
	</div>
</template>

<script setup>
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
