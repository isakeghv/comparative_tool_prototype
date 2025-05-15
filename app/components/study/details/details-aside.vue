<template>
    <aside class="aside">
        <div class="aside__container">
            <p class="aside__headline font-large font-semi">Study auto-close</p>
            <p class="aside__paragraph">Set a rule for when the study should close. Multiple can be selected. It will close when the first selected condition is met or stay open until manually closed.</p>
        </div>
        <div class="aside__container">
            <div class="aside__selection aside__selection--spaced">
                <input type="checkbox" id="details_duration_checkbox" class="aside__checkbox" value="duration" v-model="closingMethods" @change="updateClosing()" :disabled=isDisabled />
                <label for="details_duration_checkbox" class="aside__label aside__label--headline font-normal font-medium">
                    Duration
                </label>
            </div>
            <div class="aside__row">
                <span class="font-normal">Run for</span>
                <label for="details_duration_number" class="hide">Number: </label>
                <input type="number" id="details_duration_number" class="aside__input--number font-small" name="details_duration_number" min="0" step="1" v-model="durationModel" @input="durationToMs" :disabled=isDisabled />
                <label for="details_duration_unit" class="hide">Unit: </label>
                <select id="details_duration_unit" name="details_duration_unit" class="aside__select font-small" v-model="selectModel" @change="durationToMs" :disabled=isDisabled>
                    <option value="days">days</option>
                    <option value="months">months</option>
                    <option value="years">years</option>
                </select>
            </div>
        </div>
        <div class="aside__container">
            <div class="aside__selection aside__selection--spaced">
                <input type="checkbox" id="details_date_checkbox" class="aside__checkbox" value="date" v-model="closingMethods" @change="updateClosing()" :disabled=isDisabled />
                <label for="details_date_checkbox" class="aside__label aside__label--headline font-normal font-medium">
                    Date
                </label>
            </div>
            <div class="aside__row">
                <span class="font-normal">Run until</span>
                <label for="details_date" class="hide">Date: </label>
                <input type="date" id="details_date" class="aside__input--wide font-small" name="details_date" v-model="dateModel" @change="updateDate()" :disabled=isDisabled />
            </div>
        </div>
        <div class="aside__container">
            <div class="aside__selection aside__selection--spaced">
                <input type="checkbox" id="details_responses_checkbox" class="aside__checkbox" value="responses" v-model="closingMethods" @change="updateClosing()" :disabled=isDisabled />
                <label for="details_responses_checkbox" class="aside__label aside__label--headline font-medium font-semi">
                    Responses
                </label>
            </div>
            <div class="aside__row">
                <span class="font-normal">Closes at</span>
                <label for="details_responses_number" class="hide">Number: </label>
                <input type="number" id="details_responses_number" class="aside__input--number font-small" name="details_responses_number" v-model="responseModel" @input="setResLimit()" :disabled=isDisabled />
                <span class="font-normal">responses</span>
            </div>
        </div>
        <div class="aside__container">
            <p class="aside__headline font-large font-semi">Desired responses</p>
            <p class="aside__paragraph">How many responses do you want for this study?</p>
            <label for="details_desired_qty" class="hide">Responses: </label>
            <input type="number" id="details_desired_qty" class="aside__input--number font-small" name="details_desired_qty" v-model="totalResModel" @input="updateDesiredRes()" :disabled=isDisabled />
        </div>
    </aside>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const isDisabled = inject('disabled'); 

const selectModel = ref(study.closingLimit.duration['unit'] || 'days');

const durationModel = ref(study.closingLimit.duration['number'] || '')

// convert it back to a YYYY-MM-DD to make it possible to display for Date input
const dateModel = computed({
    get() {
        const raw = study.closingLimit.date;
        return raw ? new Date(raw).toISOString().split('T')[0] : '';
    },
    set(value) {
        study.closingLimit.date = value ? new Date(value).toISOString() : '';
    }
});

const responseModel = ref(study.closingLimit.responses || '');

const totalResModel = ref(study.desiredResponses || '');

//array holding the closing-methods
const closingMethods = ref(study.closingMethod || []);

//updates the amount of desired responses
const updateDesiredRes = () =>{
    if (!totalResModel.value){
        study.desiredResponses = '';
        return;
    }

    study.desiredResponses = Number(totalResModel.value);
}

const setResLimit = ()=>{
    const stop = !closingMethods.value.includes("responses");

    if (stop || !responseModel.value){
        study.closingLimit.responses = '';
        return;
    }

    study.closingLimit.responses = Number(responseModel.value);
}

//turns duration into milliseconds
const durationToMs = ()=>{
    //checking that "duration" has been selected as an alternative for closing
    const stop = !closingMethods.value.includes("duration");

    if (stop || !durationModel.value) {
        study.closingLimit.duration = {};
        return;
    }

    const unit = selectModel.value;
    const duration = Number(durationModel.value);

    let closingTime = new Date();

    if (unit === 'days') closingTime.setDate(closingTime.getDate() + duration);
    if (unit === 'months') closingTime.setMonth(closingTime.getMonth() + duration);
    if (unit === 'years') closingTime.setFullYear(closingTime.getFullYear() + duration);

    // then convert to timestamp
    study.closingLimit.duration['timestamp'] = closingTime.getTime();
    study.closingLimit.duration['number'] = durationModel.value;
    study.closingLimit.duration['unit'] = selectModel.value;
}

//updates the date that closing should be done at
const updateDate = ()=>{

    //returns boolean if date is used as closing method or not
    const dateIsClosingMethod = closingMethods.value.some(m => m === 'date');

    //return and remove if date is not selected as closing method, and/or date is empty
    if (!dateIsClosingMethod || !dateModel.value) return study.closingLimit.date = '';

    //update object
    study.closingLimit.date = dateModel.value;
}

//updating the closing-methods in reactive study variable
const updateClosing = ()=> {
    study.closingMethod = closingMethods.value

    //making sure that object exists so no errors can occur
    if (!study.closingLimit) study.closingLimit = {};

    const updateDuration = closingMethods.value.includes("duration");
    const updateDateBool = closingMethods.value.includes("date");
    const updateResponses = closingMethods.value.includes("responses");

    //updating the duration in study variable, if it has value, or removing set date in case false
    if (updateDuration) durationToMs();
    else if (study.closingLimit.duration) study.closingLimit.duration = {};

    //updating the date in study variable, if it has value, or removing set date in case false
    if (updateDateBool) updateDate();
    else if (study.closingLimit.date) study.closingLimit.date = '';

    //updates response-limit in reactive variable
    if (updateResponses) setResLimit();
    else if (study.closingLimit.responses) study.closingLimit.responses = '';
}

const props = defineProps({
    id: String,
    disabled: { type: Boolean, default: false }
})
</script>

<style scoped>
    @import url('public/style/components/study/study-aside.scss');
</style>

