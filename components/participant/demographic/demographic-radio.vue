<template>
    <div v-for="(option, i) in question.radio.options" class="response__option">
        <input type="radio" :id="`option_${i}_${question.id}`" :name="`option_${question.id}`" :value=option v-model="optionModel" class="response__radio" :required="question.required" />
        <label :for="`option_${i}_${question.id}`" class="response__label font-normal">{{ option }}</label>
    </div>
</template>
<script setup>
const props = defineProps({
    question: Object
})

const optionModel = ref('');
</script>

<style scoped>
    @import url('public/style/components/participant/participant-response.scss');
</style>