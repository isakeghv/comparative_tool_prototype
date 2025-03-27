<template>
	<div class="participant__start">
	<h2 class="participant__title font-h3 font-medium">{{ study.title }}</h2>

		<!-- should check if description is empty -->
		<section class="participant__section">
			<h3>Introduction</h3>
			<p>{{ study.description }}</p>
		</section>

		<section v-if="study.customTerms.request" class="participant__section">
			<h3>Terms & Service</h3>
			<p>{{ study.customTerms.terms }}</p>
		</section>
		<div>
			<button @click="handleStart">Start</button>
		</div>
	</div>
</template>

<script setup>

const props = defineProps({
	study: Object,
	handleStart: Function
});
</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
