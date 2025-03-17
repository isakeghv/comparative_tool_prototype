<template>
    <aside class="aside">
    <!-- v-if="id" -->
        <div class="aside__container">
            <p class="aside__headline font-large font-semi">Study auto-close</p>
            <p class="aside__paragraph">Set a rule for when the study should close. Multiple can be selected. The first to occur will close the survey. Manual closure if none is selected.</p>
        </div>
        <div class="aside__container">
            <div class="aside__selection aside__selection--spaced">
                <input type="checkbox" id="details_duration_checkbox" class="aside__checkbox">
                <label for="details_duration_checkbox" class="aside__label aside__label--headline font-normal font-medium">
                    Duration
                </label>
            </div>
            <div class="aside__row">
                <span class="font-normal">Run for</span>
                <label for="details_duration_number" class="hide">Number: </label>
                <input type="number" id="details_duration_number" class="aside__input--number font-small" name="details_duration_number" min="0" step="1"/>
                <label for="details_duration_unit" class="hide">Unit: </label>
                <select id="details_duration_unit" name="details_duration_unit" class="aside__select font-small" v-model="durationSelectedUnit">
                    <option value="days">days</option>
                    <option value="months">months</option>
                    <option value="years">years</option>
                </select>
            </div>
        </div>
        <div class="aside__container">
            <div class="aside__selection aside__selection--spaced">
                <input type="checkbox" id="details_date_checkbox" class="aside__checkbox">
                <label for="details_date_checkbox" class="aside__label aside__label--headline font-normal font-medium">
                    Date
                </label>
            </div>
            <div class="aside__row">
                <span class="font-normal">Run until</span>
                <label for="details_date" class="hide">Date: </label>
                <input type="date" id="details_date" class="aside__input--wide font-small" name="details_date"/>
            </div>
        </div>
        <div class="aside__container">
            <div class="aside__selection aside__selection--spaced">
                <input type="checkbox" id="details_responses_checkbox" class="aside__checkbox">
                <label for="details_responses_checkbox" class="aside__label aside__label--headline font-medium font-semi">
                    Responses
                </label>
            </div>
            <div class="aside__row">
                <span class="font-normal">Closes at</span>
                <label for="details_responses_number" class="hide">Number: </label>
                <input type="number" id="details_responses_number" class="aside__input--number font-small" name="details_responses_number"/>
                <span class="font-normal">responses</span>
            </div>
        </div>
        <div class="aside__container">
            <p class="aside__headline font-large font-semi">Desired responses</p>
            <p class="aside__paragraph">How many responses do you want for this study?</p>
            <label for="details_desired_qty" class="hide">Responses: </label>
            <input type="number" id="details_desired_qty" class="aside__input--number font-small" name="details_desired_qty"/>
        </div>
    </aside>
</template>

<script setup>
import { study } from '~/public/script/reactive';

const props = defineProps({
    id: String,
})

// default selected duration unit to days
const durationSelectedUnit = ref('days');

</script>

<style scoped>
    @import url('public/style/components/study/study-aside.scss');
</style>