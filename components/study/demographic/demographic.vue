<template>
    <div class="demographic demographic__main">
        <h2 class="demographic__headline font-h5 font-semi">Demographics</h2>
        <div class="demographic__row">
            <label for="demographiq_request_checkbox" class="demographic__label">
                <span class="demographic__span  font-normal">Request demographics</span>
                <span class="demographic__slider" :class="{'demographic__slider--active':requestModel}">
                    <span class="demographic__thumbnail" :class="{'demographic__thumbnail--active':requestModel}"></span>
                </span>
            </label>
            <input type="checkbox" v-model="requestModel" name="" id="demographiq_request_checkbox" class="demographic__checkbox" @change="update()">
        </div>
        <Demographic-row v-if="requestModel" @edit="(id) =>selectedId = id" :index="i" :config="config" v-for="(config, i) in configs"/>
        <Demographic-add @newQuestion="(id) =>selectedId = id"/>
        </div>
    <Demographic-aside :id="selectedId" v-if="requestModel"/>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const requestModel = ref(true);

//updating if demographics should be requested or not
const update = ()=>{
    study.demographicReq = requestModel.value;
}

const selectedId = ref('')

//default questions to request if no demograpics questions are present in "study.demographics"
const defaultQuestions = [
    {question: 'Request age',required: true,  request: false, responseType: 'number', range: {min: 0, max: 100}, id: crypto.randomUUID()},
    {question: 'Request gender',required: true, request: false, responseType: 'radio', options: ['Male', 'Female'],  id: crypto.randomUUID()},
    {question: 'Request nationality',required: true, request: false, responseType: 'text', id: crypto.randomUUID() },
    {question: 'Request level of education',required: true, request: false, responseType: 'text', id: crypto.randomUUID() },
]

//initiating: if there is nothing in demographics questions, load with default setup
const initiateConfig = ()=>{
    if (study.demographic.length <= 0) study.demographic = defaultQuestions;
}

initiateConfig();

//making sure that the relevant configuration is passed
const configs = computed(()=>{
    if (!study.demographicReq) return [];
    return study.demographic;
})
</script>

<style scoped>
    @import url('public/style/components/demographics/demographics.scss');
</style>