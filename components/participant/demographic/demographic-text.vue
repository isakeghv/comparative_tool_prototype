<template>
    <label :for="`response_text_${question.id}`" class="hide">Text</label>
    <textarea 
        :id="`response_text_${question.id}`" 
        class="response__textarea font-small" 
        :name="`response_text_${question.id}`" 
        :maxlength="question.text.maxChar" 
        v-model="textModel" 
        :required="question.required"
    />
    
    <span class="response__gray font-small">
        {{ textModel.length }}/{{ question.text.maxChar }}
    </span>
</template>
<script setup>
const props = defineProps({
    question: Object
})

const textModel = ref('');

</script>

<style scoped>
    @import url('public/style/components/participant/participant-response.scss');
</style>