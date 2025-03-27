<template>
<!-- for both radio/checkbox (if it works...)-->

<div v-if="question.responseType === 'radio'">
</div>

<div v-if="question.responseType === 'checkbox'">
    {{ question.checkbox }}
</div>

</template>

<script setup>
const props = defineProps({
    question: Object
})

// const responseType = computed(() => props.question.responseType || '');
// const data = props.question[responseType];
</script>

<style scoped>

</style>