<template>
	<fieldset class="aside__container">
		<div class="aside__selection">
			<input type="radio" :value="value" name="question_radio" :id="`response_${value}_radio`"
				class="aside__radio" v-model="localModel" @change="updateResponse" />
			<label :for="`response_${value}_radio`" class="aside__label aside__label--headline font-normal font-medium">
				{{ text }}
			</label>
		</div>

		<!-- checkbox -->
		<!-- <div class="aside__options" v-show="isCheckboxResponse">
            <div class="aside__option" v-for="(option, i) in checkboxModel" :key="i">
                <label :for="`option_${option}_${i}_txt`" class="aside__label aside__identifier">{{ i + 1 }}</label>
                <input type="text" :id="`option_${option}_${i}_txt`" class="aside__input" v-model="checkboxModel[i]">
                <button class="aside__button aside__button--remove" @click="deleteCheckbox(i)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="aside__cross" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
            <button class="aside__button aside__button--add font-semi font-small" @click="addCheckbox()">Add option</button>
        </div> -->
		<div class="aside__row aside__row--toggle" v-show="isCheckboxResponse">
			<label for="question_selection_min" class="aside__label font-normal">Selection from </label>
			<input type="number" id="question_selection_min" class="aside__input--number font-small"
				name="question_selection_min" min="0" step="1" v-model="selectionMinModel" />
			<label for="question_selection_max" class="aside__label font-normal">to</label>
			<input type="number" id="question_selection_max" class="aside__input--number font-small"
				name="question_selection_max" step="1" v-model="selectionMaxModel" />
		</div>

		<!-- range -->
		<div class="aside__row aside__row--toggle" v-show="isRangeResponse">
			<label for="question_range_min" class="aside__label font-normal">
				Min
			</label>
			<input type="number" id="question_range_min" class="aside__input--number font-small"
				name="question_range_min" step="1" v-model.number="minModel" />
			<label for="question_range_start" class="hide">Start label</label>
			<input type="text" id="question_range_start" class="aside__input--wide" name="question_range_start"
				placeholder="Start label (optional)" v-model="rangeStartModel">
		</div>
		<div class="aside__row" v-show="isRangeResponse">
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
		<div class="aside__options" v-show="isDropResponse">
			<div class="aside__option" v-for="(option, i) in dropBoxModel" :key="i">
				<label :for="`option_${option}_${i}_txt`" class="aside__label aside__box">Drop-box</label>
				<input type="text" :id="`option_${option}_${i}_txt`" class="aside__input" v-model="dropBoxModel[i]">
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
		<div class="aside__row aside__row--toggle" v-show="isLinearResponse">
			<label for="question_range_start_label" class="font-small">Start</label>
			<input type="text" id="question_range_start_label" class="aside__input--wide"
				placeholder="Start label (optional)" v-model="linearStartModel">
		</div>
		<div class="aside__row" v-show="isLinearResponse">
			<label for="question_range_end_label" class="font-small">End</label>
			<input type="text" id="question_range_end_label" class="aside__input--wide"
				placeholder="End label (optional)" v-model="linearEndModel">
		</div>
	</fieldset>

</template>

<script setup>
import { study } from '~/public/script/reactive';
import { addNewOption, removeOptionAtIndex } from '~/server/utils/studyUtils';

const props = defineProps({
	question: Object,
	modelValue: String,
	value: String,
	text: String,
	id: String
});

const emit = defineEmits(['update:modelValue', 'update:questionValues']);

const responseModel = ref('');
// const checkboxModel = ref([]);
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

// const isCheckboxResponse = computed(() => {
// 	const result = props.value === 'checkbox' && thisQuestion().responseType === 'checkbox';
// 	console.log('isCheckboxResponse:', result);
// 	return result;
// });

// const isRangeResponse = computed(() => {
// 	const result = props.value === 'range' && thisQuestion().responseType === 'range';
// 	console.log('isRangeResponse:', result);
// 	return result;
// });

// const isDropResponse = computed(() => {
// 	const result = props.value === 'drop' && thisQuestion().responseType === 'drop';
// 	console.log('isDropResponse:', result);
// 	return result;
// });

// const isLinearResponse = computed(() => {
// 	const result = props.value === 'linear' && thisQuestion().responseType === 'linear';
// 	console.log('isLinearResponse:', result);
// 	return result;
// });

const isCheckboxResponse = computed(() => props.value === 'checkbox' && thisQuestion().responseType === 'checkbox');
const isRangeResponse = computed(() => props.value === 'range' && thisQuestion().responseType === 'range');
const isDropResponse = computed(() => props.value === 'drop' && thisQuestion().responseType === 'drop');
const isLinearResponse = computed(() => props.value === 'linear' && thisQuestion().responseType === 'linear');


// create a computed property for two-way binding so parent knows what the response type is, and can change accordingly
const localModel = computed({
	get: () => props.modelValue,
	set: (newValue) => {
		emit('update:modelValue', newValue);
	}
});

const addDropBox = () => {
	addNewOption(props.question.drop.dropBox, dropBoxModel.value);
};

const deleteDropBox = (i) => {
	removeOptionAtIndex(props.question.drop.dropBox, dropBoxModel.value, i);
}

// emit all the question option values at once to parent
const updateValues = () => {
	emit("update:questionValues", {
		responseType: responseModel.value,
		checkbox: {
			// options: checkboxModel.value,
			selectionMin: selectionMinModel.value,
			selectionMax: selectionMaxModel.value
		},
		range: {
			min: minModel.value,
			max: maxModel.value,
			startLabel: rangeStartModel.value,
			endLabel: rangeEndModel.value
		},
		linear: {
			startLabel: linearStartModel.value,
			endLabel: linearEndModel.value
		},
		drop: {
			dropBoxes: dropBoxModel.value
		}
	});
};

watch(
	() => props.question,
	(newQuestion) => {
		if (!newQuestion) return;

		// populate the input fields to match the current question configuration
		// checkboxModel.value = newQuestion?.checkbox?.options;
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

// update when either of the response type changes, and emit the updated values to parent
watch([selectionMinModel, selectionMaxModel, minModel, maxModel, rangeStartModel, rangeEndModel, dropBoxModel, linearStartModel, linearEndModel], updateValues, { deep: true } );

</script>

<style scoped>
@import url('public/style/components/study/study-aside.scss');
</style>
