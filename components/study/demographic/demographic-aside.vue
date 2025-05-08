<template>
    <aside class="aside" v-if="id">
        <div class="aside__container aside__container--borderless">
            <label for="demographic_question" class="aside__label aside__headline font-large font-semi">
                Question
            </label>
            <textarea id="demographic_question_textarea" class="aside__textarea font-small" v-model="questionModel" @input="updateQuestion()" :disabled=isDisabled></textarea>
        </div>
        <div class="aside__container aside__selection aside__bottom">
            <label for="demographic_required" class="aside__label aside__label--headline font-normal font-medium">
                Required
            </label>
            <input type="checkbox" id="demographic_required_checkbox" class="aside__checkbox" v-model="requiredModel" @change="updateRequired()" :disabled=isDisabled>
        </div>
        <div class="aside__container">
            <p class="font-large font-semi">Response format</p>
        </div>
        <div class="aside__container">
            <fieldset class="aside__fieldset">
                <div class="aside__selection">
                    <input type="radio" value="text" name="aside__radio" id="demographic_text_radio" class="aside__radio" v-model="responseModel" :disabled=isDisabled>
                    <label for="demographic_text_radio" class="aside__label aside__label--headline font-normal font-medium">
                        Text
                    </label>
                </div>
                <div class="aside__row aside__row--toggle" v-if="isTextResponse">
                    <label for="demographic_text_number" class="hide">Max word count: </label>
                    <input type="number" id="demographic_text_number" class="aside__input--number font-small"
                    name="demographic_text_number" min="0" max="3000" step="100" v-model="textModel" placeholder="0" :disabled=isDisabled />
                    <span class="font-normal"> / 3000 characters</span>
                </div>     
            </fieldset>
        </div>
        <div class="aside__container">
            <div class="aside__selection">
                <input type="radio" value="radio" name="demographic_radio" id="demographic_radio" class="aside__radio" v-model="responseModel" :disabled=isDisabled>
                <label for="demographic_radio" class="aside__label aside__label--headline font-normal font-medium">
                    Multiple choice
                </label>
            </div>
            <div class="aside__options" v-if="isRadioResponse">
                <div class="aside__option" v-for="(option, i) in optionsModel" :key="i">
                    <label :for="`option_${option}_${i}_txt`" class="aside__label aside__identifier">{{ i + 1 }}</label>
                    <input type="text" :id="`option_${option}_${i}_txt`" class="aside__input" v-model="optionsModel[i]" maxlength="20" :disabled=isDisabled>
                    <button v-if="!isDisabled && optionsLength" class="aside__button aside__button--remove font-small font-medium" @click="deleteOption(i)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="aside__cross" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </button>
                </div>
                <button v-if="!isDisabled" class="aside__button aside__button--add" @click="addOption" :disabled="optionsModel.length >= 15">Add option</button>
            </div>
        </div>
        <div class="aside__container">
            <fieldset class="aside__fieldset">
                <div class="aside__selection">
                    <input type="radio" value="number" name="demographic_radio" id="demographic_number_radio" class="aside__radio" v-model="responseModel" :disabled=isDisabled>
                    <label for="demographic_number_radio" class="aside__label aside__label--headline font-normal font-medium">
                        Number
                    </label> 
                </div>      
                <div class="aside__row aside__row--toggle" v-if="isNumberResponse">
                        <label for="demographic_number_min" class="aside__label font-normal">Min</label>
                        <input type="number" id="demographic_number_min" class="aside__input--number font-small" name="demographic_number_min" min="0" step="1" v-model="minModel" :disabled=isDisabled>
                        <label for="demographic_number_max" class="aside__label font-normal">Max</label>
                        <input type="number" id="demographic_number_max" class="aside__input--number font-small" name="demographic_number_max" step="1" v-model="maxModel" :disabled=isDisabled>
                </div>         
            </fieldset>
        </div>
        <div class="aside__container">
            <div class="aside__selection">
                <input type="radio" value="date" name="demographic_radio" id="demographic_date_radio" class="aside__radio" v-model="responseModel" :disabled=isDisabled>
                <label for="demographic_date_radio" class="aside__label aside__label--headline font-normal font-medium">
                    Date
                </label>
            </div>
        </div>
        <div class="aside__container aside__container--borderless">
            <button v-if="!isDisabled" class="aside__button aside__button--delete" @click="deleteQuestion()">
                Delete question
            </button>
        </div>
    </aside>
</template>

<script setup>
import { addNewOption, removeOptionAtIndex } from '~/utils/studyUtils';
import { study } from '~/public/script/reactive';
const isDisabled = inject('disabled');

const props = defineProps({
    id: String
})

const selectedQuestion = ref('')
const requiredModel = ref('');

const questionModel = ref('');
const responseModel = ref();
const optionsModel = ref([]);

// default the options of different response types (text/number/date)
const textModel = ref();
const minModel = ref();
const maxModel= ref();

//for finding a specific id in an array and returning the relevant option
const returnDemographic = (id) => study.demographic.find(demographic => demographic.id === id) || null;

//deleting demographic question
const deleteQuestion = ()=>{
    const thisDemographic = returnDemographic(props.id);
    study.demographic = study.demographic.filter(e => e !== thisDemographic);
}

//updating required status for the question
const updateRequired = ()=>{
    const thisDemographic = returnDemographic(props.id)
    thisDemographic.required = requiredModel.value;
}

//makes sure the demographics question is updated
const updateQuestion = ()=>{
    const thisDemographic = returnDemographic(props.id)
    thisDemographic.question = questionModel.value;
}


//initiating. So the correct radio-button is checked, and the question is included in the text-area
const initiateConfig = (id)=>{
    const demographic = returnDemographic(id);
    if (!demographic) return;

    //locating the correct question of the demographic questions
    selectedQuestion.value = JSON.parse(JSON.stringify(demographic));

    //returning if not found (is issue)
    if (!selectedQuestion) return;

    //inputting relevant value to vmodels when everything is good
    questionModel.value = selectedQuestion.value.question;
    requiredModel.value = selectedQuestion.value.required;
    responseModel.value = selectedQuestion.value.responseType;

    // for the different options for the questions
    textModel.value = selectedQuestion.value.text?.maxChar;
    optionsModel.value = selectedQuestion.value.radio?.options;
    minModel.value = selectedQuestion.value.number.min;
    maxModel.value = selectedQuestion.value.number.max;
}

const addOption = () => {
    if (optionsModel.value.length >= 15) return;
    addNewOption(selectedQuestion.value.radio.options, optionsModel.value);
};

const deleteOption = (i) => {
    removeOptionAtIndex(selectedQuestion.value.radio.options, optionsModel.value, i);
}

//handling if multiple-choice options should be displayed or not
const isRadioResponse = computed(() => responseModel.value === 'radio');
const isTextResponse = computed(() => responseModel.value === 'text');
const isNumberResponse = computed(() => responseModel.value === 'number');

// don't delete box if it's just one there
const optionsLength = computed(() => optionsModel.value?.length > 1);

// when a new question is selected, the question config gets updated
watch(
    () => props.id,
    (id) => initiateConfig(id),
)

// update the response type of a question to the new value (newResponse) when switching to another question
watch(responseModel, (newResponse) => {
    const thisDemographic = returnDemographic(props.id);
    if (thisDemographic) {
        thisDemographic.responseType = newResponse;
    }
});

// update the nested values of a response type when switching to another question; watching each v-model of the array to be less repetitive
watch([textModel, optionsModel, minModel, maxModel], () => {
    const thisDemographic = returnDemographic(props.id);

    if (!thisDemographic) return;

    thisDemographic.text.maxChar = textModel.value;
    thisDemographic.number.min = minModel.value;
    thisDemographic.number.max = maxModel.value;
    thisDemographic.radio.options = optionsModel.value;
});
</script>

<style scoped>
    @import url('public/style/components/study/study-aside.scss');
</style>

