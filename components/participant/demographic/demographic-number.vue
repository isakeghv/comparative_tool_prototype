<template>
    <label :for="`response_number_${question.id}`" class="response__label hide">Number</label>
    <input type="number"
        :id="`response_number_${question.id}`"
        :name="`response_number_${question.id}`"
        v-model="numberModel" 
        :min="question.number?.min"
        :max="question.number?.max" class="response__number font-small"
        :required="question.required"
        @input="input"
        v-if="question.number"/>

    <span class="response__gray font-small" v-if="question.number">
        Enter a number between {{ question.number.min }} and {{ question.number.max }}
    </span>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    question: Object
})

const numberModel = ref();

const emit = defineEmits(['update']);

const input = () =>{
    emit('update', numberModel.value);
}
</script>

<style scoped>
    @import url('public/style/components/participant/participant-response.scss');
</style>