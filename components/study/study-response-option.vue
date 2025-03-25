<template>
	<fieldset class="aside__container">
		<div class="aside__selection">
			<input type="radio" :value="value" name="question_radio" :id="`response_${value}_radio`"
				class="aside__radio" v-model="responseModel" @change="updateValues()" />
			<label :for="`response_${value}_radio`" class="aside__label aside__label--headline font-normal font-medium">
				{{ text }}
			</label>
		</div>
		<div class="aside__row aside__row--toggle" v-if="isCheckboxResponse">
			<label for="question_selection_min" class="aside__label font-normal">Possible, from </label>
			<input type="number" id="question_selection_min" class="aside__input--number font-small"
				name="question_selection_min" min="0" step="1" v-model="selectionMinModel" />
			<label for="question_selection_max" class="aside__label font-normal">to</label>
			<input type="number" id="question_selection_max" class="aside__input--number font-small"
				name="question_selection_max" step="1" v-model="selectionMaxModel" />
		</div>

		<!-- range -->
		<div class="aside__row aside__row--toggle" v-if="isRangeResponse">
			<label for="question_range_min" class="aside__label font-normal">
				Min
			</label>
			<input type="number" id="question_range_min" class="aside__input--number font-small"
				name="question_range_min" step="1" v-model.number="minModel" />
			<label for="question_range_start" class="hide">Start label</label>
			<input type="text" id="question_range_start" class="aside__input--wide" name="question_range_start"
				placeholder="Start label (optional)" v-model="rangeStartModel">
		</div>
		<div class="aside__row" v-if="isRangeResponse">
			<label for="question_range_max" class="aside__label font-normal">
				Max
			</label>
			<input type="number" id="question_range_max" class="aside__input--number font-small"
				name="question_range_max" step="1" v-model="maxModel" />
			<label for="question_range_end" class="hide">End label</label>
			<input type="text" id="question_range_end" class="aside__input--wide" name="question_range_end"
				placeholder="End label (optional)" v-model="rangeEndModel">
		</div>

		<!-- drag and drop -->
		<div class="aside__options" v-if="isDropResponse">
			<div class="aside__option" v-for="(option, i) in dropBoxModel" :key="i">
				<label :for="`option_${option}_${i}_txt`" class="aside__label aside__box">Box {{ i + 1}}</label>
				<input type="text" :id="`option_${option}_${i}_txt`" class="aside__input" v-model="dropBoxModel[i]" @input="updateDropOption()">
				<button class="aside__button aside__button--remove" @click="deleteDropBox(i)">
					<svg xmlns="http://www.w3.org/2000/svg" class="aside__cross" height="24px" viewBox="0 -960 960 960"
						width="24px">
						<path
							d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
					</svg>
				</button>
			</div>
			<button class="aside__button aside__button--add font-small" @click="addDropBox()">Add drop-box</button>
		</div>

		<!-- linear sorting -->
		<div class="aside__row aside__row--toggle" v-if="isLinearResponse">
			<label for="question_range_start_label" class="font-small">Start</label>
			<input type="text" id="question_range_start_label" class="aside__input--wide"
				placeholder="Start label (optional)" v-model="linearStartModel">
		</div>
		<div class="aside__row" v-if="isLinearResponse">
			<label for="question_range_end_label" class="font-small">End</label>
			<input type="text" id="question_range_end_label" class="aside__input--wide"
				placeholder="End label (optional)" v-model="linearEndModel">
		</div>
	</fieldset>
</template>

<script setup>
import { study } from '~/public/script/reactive';
import { removeOptionAtIndex } from '~/server/utils/studyUtils';

const props = defineProps({
	question: Object,
	modelValue: String,
	value: String,
	text: String,
	id: String
});

const emit = defineEmits(['update']);

const responseModel = ref('');
const selectionMinModel = ref('');
const selectionMaxModel = ref('');
const minModel = ref('');
const maxModel = ref('');
const rangeStartModel = ref('');
const rangeEndModel = ref('');
const dropBoxModel = ref([]);
const linearStartModel = ref('');
const linearEndModel = ref('');

const thisQuestion = () => study.questions.find(q => q.id === props.id);

const isCheckboxResponse = computed(() => props.value === 'checkbox' && thisQuestion().responseType === 'checkbox');
const isRangeResponse = computed(() => props.value === 'range' && thisQuestion().responseType === 'range');
const isDropResponse = computed(() => props.value === 'drop' && thisQuestion().responseType === 'drop');
const isLinearResponse = computed(() => props.value === 'linear' && thisQuestion().responseType === 'linear');

//adding new dropbox to array
const addDropBox = () => dropBoxModel.value.push('');

const updateDropOption = ()=>{
	const id = props.question.id

	//searching through questions in the current study to get the current question.
	const q = study.questions.find(q => q.id == id);

	//returning if unable to get the correct question being updated
	if (!q) return alert('Unable to locate the question being modified');
	
	q.drop.dropBox = dropBoxModel.value;
}

//handles so the responseType is correct when changing questions
const initiateTypeModel = () =>{
	responseModel.value = props.question.responseType;
}

const deleteDropBox = (i) => {
	removeOptionAtIndex(props.question.drop.dropBox, dropBoxModel.value, i);
	updateDropOption();
}

const updateValues = () =>{
	const checkbox = {
		selectionMin: selectionMinModel.value,
		selectionMax: selectionMaxModel.value
	}

	const responseType = responseModel.value;

	const range = {
		min: minModel.value,
		max: maxModel.value,
		startLabel: rangeStartModel.value,
		endLabel: rangeEndModel.value
	}

	const linear = {
		startLabel: linearStartModel.value,
		endLabel: linearEndModel.value
	}

	const drop = {
		dropBox: dropBoxModel.value
	}

	emit('update', {responseType, checkbox, range, linear, drop});
}

//to initiate dropBox response option
const initiateDropBox = () => {
	//returning in case the current iteration is not for dropbox: To avoid redundant loopings and actions
	if (props.question.responseType !== 'drop' && props.value !== 'drop') return;
	dropBoxModel.value = props.question.drop.dropBox
}

initiateDropBox();

initiateTypeModel();

watch(
	() => props.question,
	(newQuestion) => {
		if (!newQuestion) return;
		selectionMinModel.value = newQuestion?.checkbox?.selectionMin;
		selectionMaxModel.value = newQuestion?.checkbox?.selectionMax;
		minModel.value = newQuestion?.range?.min;
		maxModel.value = newQuestion?.range?.max;
		rangeStartModel.value = newQuestion?.range?.startLabel;
		rangeEndModel.value = newQuestion?.range?.endLabel;
		dropBoxModel.value = newQuestion?.drop?.dropBox || [];
		linearStartModel.value = newQuestion?.linear?.startLabel;
		linearEndModel.value = newQuestion?.linear?.endLabel;
	},
	// need to use the `deep` option as well to react to nested objects like `props.question`
	{ deep: true, immediate: true }
);

watch(
	() => props.modelValue,
	(newValue) => {
		responseModel.value = newValue;
	}
);

</script>

<style scoped>
@import url('public/style/components/study/study-aside.scss');
</style>
