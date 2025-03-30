<template>
    <!-- {{ question.linear }} -->
    <div class="question__cont--top">
        <div class="question__panel question__panel--left">
            <h2 class="question__headline font-h5 font-semi">{{ question.question }}</h2>
            <div class="question__list">
                <slot name="left"></slot>
            </div>
        </div>

        <div class="question__panel">
            <slot name="right"></slot>
        </div>
    </div>

    <div class="question__cont--btm"></div>
</template>

<script setup>
const props = defineProps({
    question: Object
})
</script>

<style scoped>
    @import url('public/style/components/participant/participant-question.scss');
</style>