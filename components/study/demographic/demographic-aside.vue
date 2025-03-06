<template>
    <aside class="aside" v-if="id">
        <div class="aside__container">
            <label for="demographic_question_textarea" class="aside__label aside__label--headline">
                Question
            </label>
            <textarea id="demographic_question_textarea" class="aside__textarea" v-model="questionModel" @input="updateQuestion()"></textarea>
        </div>
        <div class="aside__container">
            <label for="demographic_required_textarea" class="aside__label aside__label--headline">
                Make question required
            </label>
            <input type="checkbox" id="demographic_required_textarea" class="aside__checkbox" v-model="requiredModel" @change="updateRequired()">
        </div>
        <div class="aside__container">
            <p class="aside__paragraph">Response format</p>
        </div>
        <div class="aside__container">
            <input type="radio" value="text" name="demographic__radio" id="demographic_text_radio" class="demographic__radio" v-model="responseModel">
            <label for="demographic_text_radio" class="aside__label">
                Text
            </label>
        </div>
        <div class="aside__container">
            <input type="radio" value="radio" name="demographic__radio" id="demographic_multiple_radio" class="demographic__radio" v-model="responseModel">
            <label for="demographic_multiple_radio" class="aside__label">
                Multiple choise
            </label>
            <div class="aside__options" v-if="showOptions">
                <div class="aside__option" v-for="(option, i) in optionsModel" :key="i">
                    <label :for="`option_${option}_${i}_txt`" class="aside__label">{{ i + 1 }}</label>
                    <input type="text" :id="`option_${option}_${i}_txt`" class="aside__input" v-model="optionsModel[i]">
                    <button class="aside__button aside__button--option" @click="deleteOption(i)">Delete</button>
                </div>
                <button class="aside__button aside__button--add" @click="addOption()">Add option</button>
            </div>
        </div>
        <div class="aside__container">
            <input type="radio" value="number" name="demographic__radio" id="demographic_number_radio" class="demographic__radio" v-model="responseModel">
            <label for="demographic_number_radio" class="aside__label">
                Number - dropdown
            </label>
        </div>
        <div class="aside__container">
            <input type="radio" value="date" name="demographic__radio" id="demographic_date_radio" class="demographic__radio" v-model="responseModel">
            <label for="demographic_date_radio" class="aside__label">
                Date
            </label>
        </div>
        <div class="aside__container">
            <button class="aside__button aside__button--delete" @click="deleteQuestion()">
                Delete question
            </button>
        </div>
    </aside>

</template>

<script setup>
import { study } from '~/public/script/reactive';

const props = defineProps({
    id: String,
})

const selectedQuestion = ref('')
const requiredModel = ref('');

const questionModel = ref();
const responseModel = ref();
const optionsModel = ref([]);

//for iterating through the array and returning the relevant option
const returnDemographic = (id)=>{
    for (let i = 0; i < study.demographic.length; i++){
        const thisDemographic = study.demographic[i];
        if (thisDemographic.id == id)return thisDemographic;
    }
}

//returning the relevant item to delete
const removeItem = (array, item) => {
    return array.filter(element => element !== item);
};

const deleteOption = (index)=>{
    optionsModel.value.splice(index, 1);
    selectedQuestion.value.options = optionsModel.value;

}

//deleting demographic question
const deleteQuestion = ()=>{
    const thisDemographic = returnDemographic(props.id)
    study.demographic = removeItem(study.demographic, thisDemographic);
}

//updating required status for the question
const updateRequired = ()=>{
    const thisDemographic = returnDemographic(props.id)

    thisDemographic.required =requiredModel.value;

}

//makes sure the demographics question is updated
const updateQuestion = ()=>{
    const thisDemographic = returnDemographic(props.id)

    thisDemographic.question = questionModel.value
}

//initiating. So the correct radio-button is checked, and the question is included in the text-area
const initiateConfig = (id)=>{

    //locating the correct question of the demographic questions
    selectedQuestion.value = returnDemographic(id);

    //returning if not found (is issue)
    if (!selectedQuestion) return;

    //inputting relevant value to vmodels when everything is good
    responseModel.value = selectedQuestion.value.responseType;
    questionModel.value = selectedQuestion.value.question;
    optionsModel.value = selectedQuestion.value.options;
    requiredModel.value = selectedQuestion.value.required;
}

const addOption = ()=>{
    //add "options" if issue not already existing: question does not have options
    if (!selectedQuestion.value.options) selectedQuestion.value.options = [];


    //pushing new option to multiple-choise
    selectedQuestion.value.options.push('');
    optionsModel.value = selectedQuestion.value.options;
}

//handling if multiple-choise options should be displayed or not
const showOptions = computed(()=>{
    return responseModel.value === 'radio';
})

watch(
    () => props.id,
    (id) => initiateConfig(id)
)

</script>

<style scoped>

</style>