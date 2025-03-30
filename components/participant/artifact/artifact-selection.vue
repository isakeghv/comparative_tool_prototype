<template>
    <!-- for both radio/checkbox (if it works...)-->
    <div class="participant__cont--alt">
        <h2 class="question__headline font-h5 font-semi">{{ question.question }}</h2>
        <slot name="default"></slot> 

        <div v-if="question.responseType === 'radio'">
        </div>

        <div v-if="question.responseType === 'checkbox'">
            {{ question.checkbox }}
        </div>
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
    @import url('public/style/components/participant/participant-question.scss');
</style>