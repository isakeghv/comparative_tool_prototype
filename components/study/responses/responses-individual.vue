<template>
    <!-- how the base question is structured -->
    <div class="responses__cont">
        <h2 class="font-h5 font-medium">{{ question.question }}</h2>
        <div>{{ answers }}</div>
        individual!!!!
    </div>
</template>

<script setup>
const props = defineProps({
    question: Object,
    answers: Array
});
</script>

<style scoped>
    @import url('public/style/components/responses/responses-template.scss');
</style>
    