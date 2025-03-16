<template>
    <fieldset class="aside__container">
        <div class="aside__selection">
            <input type="radio" :value="value" name="question_radio" :id="`response_${value}_radio`"
                class="aside__radio" v-model="localModel" @change="updateResponse" />
            <label :for="`response_${value}_radio`" class="aside__label aside__label--headline font-normal font-medium">
                {{ text }}
            </label>
        </div>

        <div class="aside__row aside__row--toggle" v-if="isRangeResponse">
            <label for="question_range_min" class="aside__label font-normal">
                Min
            </label>
            <input type="number" id="question_range_min" class="aside__input--number font-small"
                name="question_range_min" min="0" step="1" v-model="minModel" />
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
const props = defineProps({
    question: Object,
    modelValue: String,
    value: String,
    text: String,
    id: String
});

const thisquestion = computed(() => study.questions.find(q => q.id === props.id));

const emit = defineEmits(['update:modelValue', 'update:questionValues']);

// create a computed property for two-way binding so parent knows what the response type is, and can change accordingly
const localModel = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        emit('update:modelValue', newValue);
    }
});

const responseModel = ref('');
const minModel = ref('');
const maxModel = ref('');
const rangeStartModel = ref('');
const rangeEndModel = ref('');
const linearStartModel = ref('');
const linearEndModel = ref('');

// const isCheckboxResponse = computed(() => props.value === 'checkbox' && responseModel.value === 'checkbox');
const isRangeResponse = computed(() => thisquestion.value.responseType == 'range' && props.value === 'range');
const isLinearResponse = computed(() => thisquestion.value.responseType == 'linear'&& props.value === 'linear');

// emit all the question option values at once to parent
const updateValues = () => {
    emit("update:questionValues", {
        responseType: responseModel.value,
        range: {
            min: minModel.value,
            max: maxModel.value,
            startLabel: rangeStartModel.value,
            endLabel: rangeEndModel.value
        },
        linear: {
            startLabel: linearStartModel.value,
            endLabel: linearEndModel.value
        }
    });
};

watch(
    () => props.question,
    (newQuestion) => {
        if (!newQuestion) return;

        // populate the input fields to match the current question configuration
        minModel.value = newQuestion?.range?.min;
        maxModel.value = newQuestion?.range?.max;
        rangeStartModel.value = newQuestion?.range?.startLabel;
        rangeEndModel.value = newQuestion?.range?.endLabel;
        linearStartModel.value = newQuestion?.linear?.startLabel;
        linearEndModel.value = newQuestion?.linear?.endLabel;
    },
    // need to use the `deep` option as well to react to nested objects like `props.question`
    { deep: true, immediate: true }
);

// update when either of the response type changes, and emit the updated values to parent
watch([minModel, maxModel, rangeStartModel, rangeEndModel, linearStartModel, linearEndModel], updateValues, { deep: true });

</script>

<style scoped>
@import url('public/style/components/study/study-aside.scss');
</style>
