<template>
    <aside class="aside">
        <div class="aside__container">
            <p class="font-large font-semi">Response format</p>
        </div>
        <div class="aside__container">
            <fieldset class="aside__fieldset">
                <div class="aside__selection">
                    <input type="radio" value="radio" name="aside__radio" id="question_radio" class="aside__radio" v-model="responseModel">
                    <label for="question_radio" class="aside__label aside__label--headline font-normal font-medium">
                        Radio
                    </label>
                </div>
                <!-- to be planned maybe... -->
                <!-- <div class="aside__row aside__row--toggle" v-if="isRadioResponse"></div> -->     
            </fieldset>
        </div>
        <div class="aside__container">
            <div class="aside__selection">
                <input type="radio" value="checkbox" name="question_checkbox" id="question_checkbox" class="aside__radio" v-model="responseModel">
                <label for="question_checkbox" class="aside__label aside__label--headline font-normal font-medium">
                    Checkbox
                </label>
            </div>
            <div class="aside__options" v-if="isCheckboxResponse">
                <div class="aside__option" v-for="(option, i) in dropBoxModel" :key="i">
                    <!-- */<label :for="`option_${option}_${i}_txt`" class="aside__label">{{ i + 1 }}</label>
                    <input type="text" :id="`option_${option}_${i}_txt`" class="aside__input" v-model="dropBoxModel[i]">
                    <button class="aside__button aside__button--option" @click="deleteOption(i)">Delete</button> -->
                </div>
                <button class="aside__button aside__button--add" @click="addOption()">Add option</button>
            </div>
        </div>
        <div class="aside__container">
            <fieldset class="aside__fieldset">
                <div class="aside__selection">
                    <input type="radio" value="range" name="question_range" id="question_range" class="aside__radio" v-model="responseModel">
                    <label for="question_range" class="aside__label aside__label--headline font-normal font-medium">
                        Range
                    </label> 
                </div>      
                <div class="aside__row aside__row--toggle" v-if="isRangeResponse">
                    <label for="question_range_min" class="aside__label font-normal">Min</label>
                    <input type="number" id="question_range_min" class="aside__input--number font-small" name="question_range_min" min="0" step="1" v-model="minModel"/>
                    <label for="question_range_start" class="hide">Start label</label>
                    <input type="text" id="question_range_start" class="aside__input--wide" name="question_range_start" placeholder="Start label (optional)" v-model="rangeStartModel">
                </div>        
                <div class="aside__row" v-if="isRangeResponse">
                    <label for="question_range_max" class="aside__label font-normal">Max</label>
                    <input type="number" id="question_range_max" class="aside__input--number font-small" name="question_range_max" step="1" v-model="maxModel"/>
                    <label for="question_range_end" class="hide">End label</label>
                    <input type="text" id="question_range_end" class="aside__input--wide"name="question_range_end" placeholder="End label (optional)" v-model="rangeEndModel">
                </div>          
            </fieldset>
        </div>
        <Reponse-drag :selectedQuestion="selectedQuestion"/>
        <div class="aside__container">
            <fieldset class="aside__fieldset">
                <div class="aside__selection">
                    <input type="radio" value="linear" name="question_linear" id="question_linear" class="aside__radio" v-model="responseModel">
                    <label for="question_linear" class="aside__label aside__label--headline font-normal font-medium">
                        Linear sorting
                    </label> 
                </div>      
                <div class="aside__row aside__row--toggle" v-if="isLinearResponse">
                    <label for="question__linear_start" class="font-small">Start</label>
                    <input type="text" id="question_range_start_label" class="aside__input--wide" placeholder="Start label (optional)" v-model="linearStartModel">
                </div>        
                <div class="aside__row" v-if="isLinearResponse">
                    <label for="question_range_start_label" class="font-small">End</label>
                    <input type="text" id="question_range_start_label" class="aside__input--wide" placeholder="End label (optional)" v-model="linearEndModel">
                </div>          
            </fieldset>
        </div>
        <div class="aside__container aside__selection">
            <label for="demographic_required" class="aside__label aside__label--headline font-normal font-medium">
                Required
            </label>
            <input type="checkbox" id="demographic_required_checkbox" class="aside__checkbox" v-model="requiredModel" @change="updateRequired()">
        </div>
        <div class="aside__container aside__container--borderless">
            <button class="aside__button aside__button--delete" @click="deleteQuestion()">
                Delete question
            </button>
        </div>
    </aside>
</template>

<script setup>
import { study } from '~/public/script/reactive';

// get the question id and index as props
const props = defineProps({
    index: Number,
    id: String
});

const selectedQuestion = ref('')
const requiredModel = ref('');

const questionModel = ref('');
const responseModel = ref();
const checkboxModel = ref([]);
const dropBoxModel = ref([]);

// default the options of different response types (checkbox/range/drag/linear)
const minModel = ref();
const maxModel= ref();
const rangeStartModel= ref('');
const rangeEndModel= ref('');
const linearStartModel= ref('');
const linearEndModel= ref('');

// display options for a response type by checking if the responseModel.value matches its response type
// const isRadioResponse = computed(() => responseModel.value === 'radio');
const isCheckboxResponse = computed(() => responseModel.value === 'checkbox');
const isRangeResponse = computed(() => responseModel.value === 'range');
const isDragResponse = computed(() => responseModel.value === 'drag');
const isLinearResponse = computed(() => responseModel.value === 'linear');

const getQuestion = (id) => study.questions.find(question => question.id === id) || null;

const initiateConfig = (id)=>{
    const questionData = getQuestion(id);
    if (!questionData) return;

    //locating the correct question of the demographic questions
    selectedQuestion.value = JSON.parse(JSON.stringify(questionData));

    //returning if not found (is issue)
    if (!selectedQuestion) return;

    //inputting relevant value to vmodels when everything is good
    questionModel.value = selectedQuestion.value.question;
    requiredModel.value = selectedQuestion.value.required;
    responseModel.value = selectedQuestion.value.responseType;

    // for the different options for the questions
    minModel.value = selectedQuestion.value.range.min;
    maxModel.value = selectedQuestion.value.range.max;
    rangeStartModel.value = selectedQuestion.value.range.startLabel;
    rangeEndModel.value = selectedQuestion.value.range.endLabel;
    linearStartModel.value = selectedQuestion.value.linear.startLabel;
    linearEndModel.value = selectedQuestion.value.linear.endLabel;
    dropBoxModel.value = selectedQuestion.value.drag.dropBoxes;
}

const addDropBox = ()=>{
    //add "options" if issue not already existing: question does not have options
    if (!selectedQuestion.value.drag.dropBoxes) selectedQuestion.value.dropBox.dropBoxes = [];

    //pushing new option to multiple-choise
    selectedQuestion.value.drag.dropBoxes.push('');
    dropBoxModel.value = selectedQuestion.value.drag.dropBoxes;
}

// delete a specific option for `Radio` at its index using splice
/* const deleteDragBox = (index) => {
    dropBoxModel.value.splice(index, 1);
    selectedQuestion.value.dropBoxes = dropBoxModel.value;
} */

/*

//for finding a specific id in an array and returning the relevant option
const returnDemographic = (id) => study.demographic.find(demographic => demographic.id === id) || null;

//returning the relevant item to delete
const removeItem = (array, item) => {
    return array.filter(element => element !== item);
};

//deleting demographic question
const deleteQuestion = ()=>{
    const thisDemographic = returnDemographic(props.id)
    study.demographic = removeItem(study.demographic, thisDemographic);
}

//updating required status for the question
const updateRequired = ()=>{
    const thisDemographic = returnDemographic(props.id)
    thisDemographic.required = requiredModel.value;
    // demographicReq
}

//makes sure the demographics question is updated
const updateQuestion = ()=>{
    const thisDemographic = returnDemographic(props.id)
    thisDemographic.question = questionModel.value;
}

// when a new question is selected, the question config gets updated
watch(
    () => props.id,
    (id) => initiateConfig(id),
    console.log('Updated study.demographic:', study.demographic)
)

// update the response type of a question to the new value (newResponse) when switching to another question
watch(responseModel, (newResponse) => {
    const thisDemographic = returnDemographic(props.id);
    if (thisDemographic) {
        thisDemographic.responseType = newResponse;
    }
});

// update the nested values of a response type when switching to another question; watching each v-model of the array to be less repetitive
watch([textModel, dropBoxModel, minModel, maxModel], () => {
    const thisDemographic = returnDemographic(props.id);

    if (!thisDemographic) return;

    thisDemographic.text.maxWords = textModel.value;
    thisDemographic.number.min = minModel.value;
    thisDemographic.number.max = maxModel.value;
    thisDemographic.radio.options = dropBoxModel.value;
});
*/
</script>

<style scoped>
    @import url('public/style/components/study/study-aside.scss');
</style>