<template>
    {{ question.range }}

    <div class="range-question">
    <label v-if="question.rangeStartLabel">{{ question.rangeStartLabel }}</label>
    <input 
      type="range" 
      :min="question.minModel" 
      :max="question.maxModel" 
      step="1" 
      v-model="selectedValue"
    />
    <label v-if="question.rangeEndLabel">{{ question.rangeEndLabel }}</label>
    <p>Valgt verdi: {{ selectedValue }}</p>
  </div>

</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
    question: Object
})

// Ensures that min/max are actual values
const minValue = computed(() => Math.max(0, props.question.minModel || 1));  // Set standard to 1, if undefined
const maxValue = computed(() => Math.max(minValue.value + 1, props.question.maxModel || 10));  // At least 1 more than minValue

// Ensure that chosen value is inside the limit
const selectedValue = ref(minValue.value);

</script>

<style scoped>
.range-question {
  display: flex;
  align-items: center;
  gap: 10px;
}
input[type="range"] {
  width: 100%;
}
</style>