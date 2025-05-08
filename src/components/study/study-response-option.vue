<template>
    <div class="aside__container">
        <div class="aside__selection">
            <input type="radio" :value="value" name="question_radio" :id="`response_${value}_radio`"
                class="aside__radio" :checked="modelValue === value" @change="handleChange" :disabled="isDisabled" />
            <label :for="`response_${value}_radio`" class="aside__label aside__label--headline font-normal font-medium">
                {{ text }}
            </label>
        </div>

		<!-- checkbox -->
        <div class="aside__row aside__row--toggle" v-if="isCheckboxResponse">
            <label for="question_selection_min" class="aside__label font-normal">Possible from </label>
            <input type="number" id="question_selection_min" class="aside__input--number font-small"
                name="question_selection_min" min="1" step="1" v-model="selectionMinModel" @input="updateMinModel()" :disabled="isDisabled"/>
            <label for="question_selection_max" class="aside__label font-normal">to</label>
            <input type="number" id="question_selection_max" class="aside__input--number font-small"
                name="question_selection_max" step="1" v-model="selectionMaxModel" @input="updateMaxModel()" :disabled="isDisabled" />
        </div>

        <!-- range -->
        <div class="aside__row aside__row--toggle" v-if="isRangeResponse">
            <label for="question_range_min" class="aside__label font-normal">
                Min
            </label>
            <input type="number" id="question_range_min" class="aside__input--number font-small"
                name="question_range_min" step="1" v-model="minModel" @input="updateMinRange(minModel)" min="1" :disabled="isDisabled" />
            <label for="question_range_start" class="hide">Start label</label>
            <input type="text" id="question_range_start" class="aside__input--wide" name="question_range_start"
                placeholder="Start label (optional)" v-model="rangeStartModel" @input="updateMinRangeLabel(rangeStartModel)" maxlength="20" :disabled="isDisabled">
        </div>
        <div class="aside__row" v-if="isRangeResponse">
            <label for="question_range_max" class="aside__label font-normal">
                Max
            </label>
            <input type="number" id="question_range_max" class="aside__input--number font-small"
                name="question_range_max" step="1" v-model="maxModel" @input="updateMaxRange(maxModel)" max="100" :disabled="isDisabled" />
            <label for="question_range_end" class="hide">End label</label>
            <input type="text" id="question_range_end" class="aside__input--wide" name="question_range_end"
                placeholder="End label (optional)" v-model="rangeEndModel" @input="updateMaxRangeLabel(rangeEndModel)" maxlength="20" :disabled="isDisabled">
        </div>

        <!-- drag and drop -->
        <div class="aside__options" v-if="isDropResponse">
            <div class="aside__option" v-for="(option, i) in dropBoxModel" :key="i">
                <label :for="`option_${i}_txt`" class="aside__label aside__box">{{ i + 1}}</label>
                <input type="text" :id="`option_${i}_txt`" class="aside__input" v-model="dropBoxModel[i]" @input="updateDropOption()" maxlength="20" :disabled="isDisabled">
                <button v-if="!isDisabled && dropBoxModel.length > 1" class="aside__button aside__button--remove" @click="deleteDropBox(i)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="aside__cross" height="24px" viewBox="0 -960 960 960"
                        width="24px">
                        <path
                            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                </button>
            </div>
            <button v-if="!isDisabled" class="aside__button aside__button--add font-small" @click="addDropBox()" :disabled="dropBoxModel.length >= 15">Add drop-box</button>
        </div>

        <!-- linear sorting -->
        <div class="aside__row aside__row--toggle" v-if="isLinearResponse">
            <label for="question_range_start_label" class="font-small">Start</label>
            <input type="text" id="question_range_start_label" class="aside__input--wide"
                placeholder="Start label (optional)" v-model="linearStartModel" @input="updateMinLinear(linearStartModel)" maxlength="50" :disabled="isDisabled">
        </div>
        <div class="aside__row" v-if="isLinearResponse">
            <label for="question_range_end_label" class="font-small">End</label>
            <input type="text" id="question_range_end_label" class="aside__input--wide"
                placeholder="End label (optional)" v-model="linearEndModel" @input="updateMaxLinear(linearEndModel)" maxlength="50" :disabled="isDisabled">
        </div>
    </div>
</template>

<script setup>
import { study } from '~/public/script/reactive';
import { removeOptionAtIndex } from '~/utils/studyUtils';

const isDisabled = inject('disabled');

const props = defineProps({
    text: String,
    value: String,
    modelValue: String,
    id: String,
    index: Number
});

const emit = defineEmits(['update:modelValue']);

// models for each response type
const selectionMinModel = ref('');
const selectionMaxModel = ref('');
const minModel = ref('');
const maxModel = ref('');
const rangeStartModel = ref('');
const rangeEndModel = ref('');
const dropBoxModel = ref([]);
const linearStartModel = ref('');
const linearEndModel = ref('');

// get the current question from study
const thisQuestion = () => study.questions.find(q => q.id === props.id);

// handle which response type should show up
const isCheckboxResponse = computed(() => props.value === 'checkbox' && props.modelValue === 'checkbox');
const isRangeResponse = computed(() => props.value === 'range' && props.modelValue === 'range');
const isDropResponse = computed(() => props.value === 'drop' && props.modelValue === 'drop');
const isLinearResponse = computed(() => props.value === 'linear' && props.modelValue === 'linear');

// update the parent with this radio button's value
const handleChange = () => {
    emit('update:modelValue', props.value);
};

// add a new drop box
const addDropBox = () => {
    if (dropBoxModel.value.length >= 15) return;

	//adding new dropbox to array
    dropBoxModel.value.push('');
};

// Update drop options in the study
const updateDropOption = () => {
    const question = thisQuestion();

    //returning if unable to get the correct question being updated
	if (!question) return alert('Unable to locate the question being modified');
    
    question.drop.dropBox = [...dropBoxModel.value];
};

// delete a drop box
const deleteDropBox = (i) => {
    // only allow deletion if there's more than one box
    if (dropBoxModel.value.length <= 1) return;
    
	removeOptionAtIndex(thisQuestion().drop.dropBox, dropBoxModel.value, i);
};


//updating response-type configurations in "study"
const updateMinLinear = (input) => thisQuestion().linear.startLabel = input;
const updateMaxLinear = (input) => thisQuestion().linear.endLabel = input;
const updateMinRangeLabel = (input) =>thisQuestion().range.startLabel = input;
const updateMaxRangeLabel = (input) =>thisQuestion().range.endLabel = input;
const updateMinRange = (input) => thisQuestion().range.min = input;
const updateMaxRange = (input) => thisQuestion().range.max = input;
const updateMinModel = () => thisQuestion().checkbox.selectionMin = selectionMinModel.value;
const updateMaxModel = () => thisQuestion().checkbox.selectionMax = selectionMaxModel.value;

// initialize models when component is created or switching to another question
watch(
    () => props.id, 
	(newId, oldId) => {
		// don't do a new lookup if still on current question
		if (!newId || newId === oldId) return;
        
        const question = thisQuestion();
        if (!question) return;
        
		selectionMinModel.value = question.checkbox?.selectionMin;
		selectionMaxModel.value = question.checkbox?.selectionMax;
		minModel.value = question.range?.min;
		maxModel.value = question.range?.max;
		rangeStartModel.value = question.range?.startLabel;
		rangeEndModel.value = question.range?.endLabel;
        dropBoxModel.value = [...question.drop.dropBox];
		linearStartModel.value = question.linear?.startLabel;
		linearEndModel.value = question.linear?.endLabel;
    },
    { immediate: true }
);

// watch for when the modelValue, which binds the response type to the parent, changes, but also the question
watch(
    [() => props.modelValue, () => props.id], 
    ([newValue, newId]) => {
        // only has to check once
        if (newValue === props.value) {

            // if (newValue === 'drop') {
            //     const isEmpty = !dropBoxModel.value.some(box => box.trim() !== '');
            //     setMessageByType('drop', 'drop', isEmpty, `Question ${props.index + 1}: Set at least one non-empty box.`);
            // }
        }
    }
);
</script>

<style scoped>
@import url('public/style/components/study/study-aside.scss');
</style>