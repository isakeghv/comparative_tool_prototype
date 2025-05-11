<template>
  <div v-for="(artifact, index) in artifacts" :key="artifact.id" class="artifact-range range-slider">
    <label :for="`artifact-range-${index}`">
      {{ artifact.name }}: {{ responses[index] }}
    </label>
    <input
      type="range"
      :id="`artifact-range-${index}`"
      :min="rangeMin"
      :max="rangeMax"
      v-model.number="responses[index]"
      @input="emitResponse(index)"
    />
  </div>
</template>


<script setup>
import { ref, watch, computed } from 'vue';
import { study } from '~/public/script/reactive';

const props = defineProps({
    question: Object,
    artifacts: Array,
})

const emit = defineEmits(['update:responses']);

const question = computed(() =>
  study.questions.find(q => q.id === props.questionId)
);

const rangeMin = computed(() => question.value?.range?.min ?? 1);
const rangeMax = computed(() => question.value?.range?.max ?? 100);

// Initialize responses array
const responses = ref([]);

watch(
  () => props.artifacts,
  (newArtifacts) => {
    responses.value = newArtifacts.map(() => rangeMin.value);
    emit('update:responses', [...responses.value]);
  },
  { immediate: true }
);

const emitResponse = (index) => {
  emit('update:responses', [...responses.value]);
};

</script>

<style scoped>
	@import url('public/style/components/study/study-main.scss');
  @import url('public/style/components/participant/participant-question.scss');
</style>