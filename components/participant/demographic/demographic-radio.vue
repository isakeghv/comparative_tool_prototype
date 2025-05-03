<template>
    <div v-if="question?.radio?.options" v-for="(option, i) in question.radio.options" :key="i" class="response__option">
      <input
        type="radio"
        :id="`option_${i}_${question.id}`"
        :name="`option_${question.id}`"
        :value="option"
        v-model="optionModel"
        class="response__radio"
        :required="question.required"
        @change="input"
      />
      <label :for="`option_${i}_${question.id}`" class="response__label font-small">{{ option }}</label>
    </div>
  </template>
  
<script setup>
import { ref } from 'vue';
const props = defineProps({
    question: Object
})

const optionModel = ref('');

const emit = defineEmits(['update']);

const input = () =>{
    emit('update', optionModel.value);
}
</script>

<style scoped>
    @import url('public/style/components/participant/participant-response.scss');
</style>