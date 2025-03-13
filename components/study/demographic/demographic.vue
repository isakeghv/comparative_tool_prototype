<template>
    <div class="demographic demographic__container">
        <div class="demographic__main">
        <h2 class="demographic__headline font-h5 font-semi">Demographics</h2>
        <div class="demographic__row">
            <label for="demographic_request_checkbox" class="demographic__label">
                <span class="demographic__span font-normal">Request demographics</span>
                <span class="demographic__slider" :class="{'demographic__slider--active':requestModel}">
                    <span class="demographic__thumbnail" :class="{'demographic__thumbnail--active':requestModel}"></span>
                </span>
            </label>
            <input type="checkbox" v-model="requestModel" name="" id="demographic__request_checkbox" class="demographic__checkbox" @change="update()">
        </div>
        <Demographic-row v-if="requestModel" @edit="(id) =>selectedId = id" :index="i" :config="config" v-for="(config, i) in configs"/>
        <Demographic-add @newQuestion="(id) =>selectedId = id"/>
        </div>
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
    {
        id: crypto.randomUUID(),
        question: 'Request age',
        request: false,
        responseType: 'number',
        required: true,
        text: {
            maxWords: 0
        },
        radio: {
            options: []
        },
        number: {
            min: 0,
            max: 100
        },
        date: {
            year: true,
            month: false,
            day: false
        }
    },
    {
        id: crypto.randomUUID(),
        question: 'Request gender',
        request: false,
        responseType: 'radio',
        required: true,
        text: {
            maxWords: 0
        },
        radio: {
            options: ['Male', 'Female']
        },
        number: {
            min: 0,
            max: 100
        },
        date: {
            year: true,
            month: false,
            day: false
        }
    },
    {
        id: crypto.randomUUID(),
        question: 'Request nationality',
        request: false,
        responseType: 'text',
        required: true,
        text: {
            maxWords: 0
        },
        radio: {
            options: []
        },
        number: {
            min: 0,
            max: 100
        },
        date: {
            year: true,
            month: false,
            day: false
        }
    },
    {
        id: crypto.randomUUID(),
        question: 'Request level of education',
        request: false,
        responseType: 'text',
        required: true,
        text: {
            maxWords: 0
        },
        radio: {
            options: []
        },
        number: {
            min: 0,
            max: 100
        },
        date: {
            year: true,
            month: false,
            day: false
        }
    }
];


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