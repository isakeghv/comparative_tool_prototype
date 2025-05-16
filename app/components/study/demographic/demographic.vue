<template>
    <div class="demographic demographic__container">
        <div style="display: flex; gap: 0.8rem; justify-content: space-between;">
            <div>
                <h2 class="demographic__headline font-h5 font-semi" :class="{'demographic__headline--margin': showResponses}">Demographics</h2>
                <div v-if="!showResponses" class="demographic__main">
                    <div class="demographic__row">
                        <label for="demographic_request_checkbox" class="demographic__label">
                            <span class="demographic__span font-normal">Request demographics</span>
                        </label>
                        <label class="demographic__slider">
                            <input type="checkbox" v-model="requestModel" id="demographic__request_checkbox" class="demographic__checkbox" @change="updateRequest()" :disabled="isDisabled">
                            <span class="demographic__thumbnail" :class="{'demographic__thumbnail--active': requestModel}"></span>
                        </label>
                    </div>

                    <DemographicRow v-if="requestModel" @edit="(id) => selectedId = id" :index="i" :config="config" v-for="(config, i) in configs"/>
                    <DemographicAdd @newQuestion="(id) => selectedId = id"/>
                </div>
                <div v-else class="demographic__main">
                    <ResponsesDemographicsAll v-if="selectedView === 'all' || selectedView === 'graphs'"
                        :respondents="studyResponses.length"
                        :demographicReq="study.demographicReq"
                        :demographic="study.demographic"
                        :selectedView="selectedView"
                        :studyResponses="studyResponses"
                    />
                    <ResponsesDemographics
                        v-else-if="selectedView === 'individual'"
                        :respondents="studyResponses.length"
                        :demographicReq="study.demographicReq"
                        :demographic="study.demographic"
                        :demographicData="demoResponse"
                    />
                </div>
            </div>
                <ResponsesSelection v-if="showResponses" v-model="selectedView" :respondents="studyResponses.length" @participantNum="handleParticipantUpdate" />
            </div>
        </div>
        
    <div class="aside-temp" v-if="selectedId === ''"></div>
    <DemographicAside :id="selectedId" v-if="requestModel && !showResponses" @deletedQuestion="handleDeletedQuestion"/>
</template>

<script setup>
import { study, showResponses } from '~/public/script/reactive';

const isDisabled = inject('disabled');
const studyResponses = inject('studyResponses');

const { selectedView, handleParticipantUpdate, demoResponse } = useResponsesSelection(studyResponses.value);

const requestModel = ref(study.demographicReq);
const selectedId = ref('')

//updating if demographics should be requested or not
const updateRequest = () => {
    study.demographicReq = requestModel.value;
}

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
            options: ['']
        },
        number: {
            min: 0,
            max: 100
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
            options: ['Male', 'Female', 'Other']
        },
        number: {
            min: '',
            max: ''
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
            options: ['']
        },
        number: {
            min: '',
            max: ''
        }
    },
    {
        id: crypto.randomUUID(),
        question: 'Request level of education',
        request: false,
        responseType: 'text',
        required: true,
        text: {
            maxChar: 200
        },
        radio: {
            options: ['']
        },
        number: {
            min: '',
            max: ''
        }
    }
];

//initiating: if there is nothing in demographics questions, load with default setup
const initiateConfig = () =>{
    if (study.demographic.length === 0) study.demographic = defaultQuestions;
}

initiateConfig();

//making sure that the relevant configuration is passed
const configs = computed(()=>{
    if (!study.demographicReq) return [];
    return study.demographic;
})

// clear `selectedId` ref on question deletion to remove aside
const handleDeletedQuestion = () => {
    selectedId.value = null; 
}
// reset selectedId when not in 'individual' view
watch(selectedView, (newValue) => {
    if (newValue !== 'individual') {
        selectedId.value = ''; 
    }
});
</script>

<style scoped>
    @import url('public/style/components/demographics/demographics.scss');

    .demographic__header {
        display: flex;
        justify-content: space-between;
    }
</style>