<template>
    <label :for="`response_number_${question.id}`" class="response__label hide">Number</label>
    <input type="number"
        :id="`response_number_${question.id}`"
        :name="`response_number_${question.id}`"
        v-model="numberModel" :min="question.number.min"
        :max="question.number.max" class="response__number font-small"
        :required="question.required"
        @input="input"/>

    <span class="response__gray font-small">
        Enter a number between {{ question.number.min }} and {{ question.number.max }}
    </span>
</template>

<script setup>
const props = defineProps({
    question: Object,
    value: {
        type: [String, Number] // is '' when no number
    }
})

const numberModel = ref(props.value || null);

// track if input is invalid
const isInvalid = ref(false); 

const emit = defineEmits(['update']);

const input = () => {
    const min = props.question.number.min;
    const max = props.question.number.max;

    // check if the value is within the valid range
    if (numberModel.value < min || numberModel.value > max) {
        isInvalid.value = true;
    } else {
        isInvalid.value = false;
    }

    // emit the updated value to parent component
    emit('update', {
        val: numberModel.value,
        isInvalid: isInvalid.value,
    });
}
</script>

<style scoped>
    @import url('public/style/components/participant/participant-response.scss');
</style>