<template>
    <fieldset class="aside__container" :disabled="disabled">
        <div class="aside__selection">
            <input type="radio" :value="value" name="question_radio" :id="`response_${value}_radio`"
                class="aside__radio" v-model="localModel" @change="updateResponse" />
            <label :for="`response_${value}_radio`" class="aside__label aside__label--headline font-normal font-medium">
                {{ text }}
            </label>
        </div>

        <!-- checkbox -->
        <div class="aside__options" v-show="isCheckboxResponse">
            <div class="aside__option" v-for="(option, i) in checkboxModel" :key="i">
                <label :for="`option_${option}_${i}_txt`" class="aside__label">{{ i + 1 }}</label>
                <input type="text" :id="`option_${option}_${i}_txt`" class="aside__input" v-model="checkboxModel[i]">
                <button class="aside__button aside__button--option" @click="deleteCheckbox(i)">Delete</button>
            </div>
            <button class="aside__button aside__button--add" @click="addCheckbox()">Add option</button>
        </div>
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
                placeholder="Start label (optional)" v-model="rangeStartModel" disabled>
        </div>
        <div class="aside__row" v-show="isRangeResponse">
            <label for="question_range_max" class="aside__label font-normal">
                Max
            </label>
            <input type="number" id="question_range_max" class="aside__input--number font-small"
                name="question_range_max" step="1" v-model="maxModel" />
            <label for="question_range_end" class="hide">End label</label>
            <input type="text" id="question_range_end" class="aside__input--wide" name="question_range_end"
                placeholder="End label (optional)" v-model="rangeEndModel" readonly>
        </div>

        <!-- drag and drop -->
        <div class="aside__options" v-show="isDropResponse">
            <div class="aside__option" v-for="(option, i) in dropBoxModel" :key="i">
                <label :for="`option_${option}_${i}_txt`" class="aside__label">Drop-box</label>
                <input type="text" :id="`option_${option}_${i}_txt`" class="aside__input" v-model="dropBoxModel[i]">
                <button class="aside__button aside__button--option" @click="deleteDropBox(i)">Delete</button>
            </div>
            <button class="aside__button aside__button--add" @click="addDropBox()">Add drop-box</button>
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
const disabled = inject('disabled');

const props = defineProps({
    question: Object,
    modelValue: String,
    value: String,
    text: String,
    id: String
});

const emit = defineEmits(['update:modelValue', 'update:questionValues']);

// create a computed property for two-way binding so parent knows what the response type is, and can change accordingly
const localModel = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        emit('update:modelValue', newValue);
    }
});

const responseModel = ref('');
const checkboxModel = ref([]);
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

const addCheckbox = () => {
    addNewOption(props.question.checkbox.options, checkboxModel.value);
};

const deleteCheckbox = (i) => {
    removeOptionAtIndex(props.question.checkbox.options, checkboxModel.value, i);
}

const addDropBox = () => {
    addNewOption(props.question.drop.dropBoxes, dropBoxModel.value);
};

const deleteDropBox = (i) => {
    removeOptionAtIndex(props.question.drop.dropBoxes, dropBoxModel.value, i);
}

// emit all the question option values at once to parent
const updateValues = () => {
    emit("update:questionValues", {
        responseType: responseModel.value,
        checkbox: {
            options: checkboxModel.value,
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
        checkboxModel.value = newQuestion?.checkbox?.options;
        selectionMinModel.value = newQuestion?.checkbox?.selectionMin;
        selectionMaxModel.value = newQuestion?.checkbox?.selectionMax;
        minModel.value = newQuestion?.range?.min;
        maxModel.value = newQuestion?.range?.max;
        rangeStartModel.value = newQuestion?.range?.startLabel;
        rangeEndModel.value = newQuestion?.range?.endLabel;
        dropBoxModel.value = newQuestion?.drop?.dropBoxes;
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
watch([checkboxModel, selectionMinModel, selectionMaxModel, minModel, maxModel, rangeStartModel, rangeEndModel, dropBoxModel, linearStartModel, linearEndModel], updateValues, { deep: true });

</script>

<style scoped>
@import url('public/style/components/study/study-aside.scss');
</style>
