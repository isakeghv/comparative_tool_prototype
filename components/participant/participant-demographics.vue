<template>
	<div class="participant__start">

		<section v-if="study?.demographicReq" class="participant__section">
			<h2 class="participant__title font-h3 font-medium">Demographics</h2>
			<p>{{ study.demographics }}</p>
		</section>
	</div>
</template>

<script setup>
const props = defineProps({
	study: Object
});
</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
