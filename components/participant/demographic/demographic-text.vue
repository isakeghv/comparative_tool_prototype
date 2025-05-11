<template>
    <label :for="`response_text_${question.id}`" class="hide">Text</label>
    <textarea 
        :id="`response_text_${question.id}`" 
        class="response__textarea font-small" 
        :name="`response_text_${question.id}`" 
        :maxlength="question.text.maxChar || 3000" 
        v-model="textModel" 
        :required="question.required" @input="input"
    />
    
    <span class="response__gray font-small">
        {{ textModel.length }}/{{ question.text.maxChar || 3000 }}
    </span>
</template>
<script setup>
const props = defineProps({
    question: Object,
    value: String
})

const textModel = ref(props.value || '');

const emit = defineEmits(['update']);

const input = () =>{
    emit('update', { val: textModel.value, isInvalid: false })
}
</script>

<style scoped>
    @import url('public/style/components/participant/participant-response.scss');
</style>