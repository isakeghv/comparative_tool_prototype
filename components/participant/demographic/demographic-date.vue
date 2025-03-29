<template>
	<label :for="`response_date_${question.id}`" class="response__label hide">Date</label>
    <input type="date" :id="`response_date_${question.id}`" :name="`response_date_${question.id}`" v-model="dateModel" min="1920-01-01" :max="today" class="response__date" :required="question.required" />
</template>

<script setup>
const props = defineProps({
    question: Object
})

const dateModel = ref('');

// set date picker to no further than today's month
const today = computed(() => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
	
	// pad with a zero if month/day is single digit
    const month = (todayDate.getMonth() + 1).toString().padStart(2, '0');
    const day = todayDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
});
</script>

<style scoped>
    @import url('public/style/components/participant/participant-response.scss');
</style>


  