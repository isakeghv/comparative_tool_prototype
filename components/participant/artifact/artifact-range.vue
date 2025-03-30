<template>
    <div class="participant__cont--alt">
        <h2 class="question__headline font-h5 font-semi">{{ question.question }}</h2>
        <slot name="default"></slot>

        {{ question.range }}
    </div>
</template>

<script setup>
const props = defineProps({
    question: Object
})
</script>

<style scoped>
    @import url('public/style/components/participant/participant-question.scss');
</style>