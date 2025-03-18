<template>
    <div class="demographic demographic__container">
        <div class="demographic__main">
        <h2 class="demographic__headline font-h5 font-semi">Demographics</h2>
        <div class="demographic__row">
            <label for="demographic_request_checkbox" class="demographic__label">
                <span class="demographic__span font-normal">Request demographics</span>
            </label>
            <label class="demographic__slider">
                <input type="checkbox" v-model="requestModel" id="demographic__request_checkbox" class="demographic__checkbox" @change="updateRequest()" :disabled="disabled">
                <span class="demographic__thumbnail" :class="{'demographic__thumbnail--active': requestModel}"></span>
            </label>
        </div>
        <DemographicRow v-if="requestModel" @edit="(id) => selectedId = id" :index="i" :config="config" v-for="(config, i) in configs"/>
        <DemographicAdd @newQuestion="(id) => selectedId = id"/>
        </div>
    </div>
    <DemographicAside :id="selectedId" v-if="requestModel"/>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const disabled = inject('disabled');

const requestModel = ref(study.demographicReq);

//updating if demographics should be requested or not
const updateRequest = ()=>{
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
            maxChar: 0
        },
        radio: {
            options: []
        },
        number: {
            min: 0,
            max: 100
        },
        date: {
            year: false,
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
            maxChar: ''
        },
        radio: {
            options: ['Male', 'Female']
        },
        number: {
            min: '',
            max: ''
        },
        date: {
            year: false,
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
            maxChar: 200
        },
        radio: {
            options: []
        },
        number: {
            min: '',
            max: ''
        },
        date: {
            year: false,
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
            maxChar: ''
        },
        radio: {
            options: []
        },
        number: {
            min: '',
            max: ''
        },
        date: {
            year: false,
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