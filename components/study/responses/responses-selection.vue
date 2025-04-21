<template>
    <div class="select__cont">
		<div class="select__row">
			<label class="font-normal" for="view_select">View </label>
			<select v-model="model" id="view_select" class="select__input">
				<option value="all">all</option>
				<option value="individual">individual</option>	
				<option value="graphs">graphs</option>
			</select>
		</div>
		<div class="select__row" :class="{'select__hide': !isIndividualOption || (respondents ?? 0) < 1}">
			<label for="participant_number">{{ }}</label> 
			<input id="participant_number"
				class="select__number font-normal"
				type="number"
				v-model="participantModel"
				:min='1'
				:max='respondents'/>
			<span class="font-normal">of</span>
			<span class="font-normal">{{ respondents }}</span>
		</div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
	modelValue: String,
	respondents: Number
})

const emit = defineEmits(['update:modelValue', 'participantNum'])

// two-way binding to get changes of components including `ResponsesSelection` set here
const model = computed({
	get: () => props.modelValue,
	set: (val) => emit('update:modelValue', val)
})

// set participantModel to the value in localStorage to remember latest participant checked when hiding/showing responses
const participantModel = ref(1);

const isIndividualOption = computed(() => model.value === 'individual');

// emit to parent the new participant number, and persist the number so it is saved between re-rendering of components
watch(participantModel, (newVal) => {
    if (newVal >= 1 && newVal <= (props.respondents ?? 1)) {
        emit('participantNum', newVal);
    }
});
</script>
  
<style scoped>
    @import url('public/style/components/responses/responses-selection.scss');
</style>
  