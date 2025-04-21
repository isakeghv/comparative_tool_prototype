<template>
    <div class="responses__cont">
        <h2 class="responses__headline font-h5 font-medium">{{ question.question }} {{ question.required ? '*' : '' }}</h2>

        <div v-if="respondents === 0">
            No participant records available at the moment.
        </div>
    </div>

    <!-- <div v-if="Array.isArray(participantData) && participantData.length === 0">
        No response was submitted for this question.
    </div> -->
</template>

<script setup>
const props = defineProps({
    question: Object,
    answers: Array,
    respondents: Number
});
</script>

<style scoped>
    @import url('public/style/components/responses/responses-template.scss');
</style>
    