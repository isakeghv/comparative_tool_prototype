<template>
  <div v-for="(artifact, index) in artifacts" :key="artifact.id" class="artifact-range range-slider">
    <div class="artifact-container artifact__borderless">
      <ArtifactMedia
        :artifact="artifact"
        responseType="range"
        @selectMedia="() => $emit('selectMedia', artifact.source, artifact.id)"
      />
      <div class="wrapper wrapper--zero">
        <ArtifactExpandButton @expand="() => $emit('selectMedia', artifact.source, artifact.id)" />
      </div>
    </div>

    <label :for="`artifact-range-${index}`">
      {{ artifact.name }} {{ responses[index] }}
    </label>

    <input
      type="range"
      :id="`artifact-range-${index}`"
      :min="rangeMin"
      :max="rangeMax"
      v-model.number="responses[index]"
      @input="emitResponse(index)"
    />
    <div class="range-labels" v-if="rangeLabels.length">
      <span>{{ rangeLabels[0] }}</span>
      <span style="float:right;">{{ rangeLabels[1] }}</span>
    </div>
  </div>
</template>


<script setup>
import { ref, watch, computed } from 'vue';


const props = defineProps({
  question: Object,
  artifacts: Array,
  questionId: String
});

const emit = defineEmits(['update:responses']);

const rangeMin = computed(() => Number(props.question?.range?.min) || 0);
const rangeMax = computed(() => Number(props.question?.range?.max) || 100);


const rangeLabels = computed(() => {
  const start = props.question?.range?.startLabel ?? '';
  const end = props.question?.range?.endLabel ?? '';
  return [start, end];
});

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