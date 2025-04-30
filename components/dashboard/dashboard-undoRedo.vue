<template>
    <button class="header__button" data-tooltip="Undo" @click="controller(1)">
        <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
            <path xmlns="http://www.w3.org/2000/svg"
                d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z" />
        </svg>
    </button>
    <button class="header__button" data-tooltip="Redo" @click="controller(-1)">
        <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
            <path xmlns="http://www.w3.org/2000/svg"
                d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z" />
        </svg>
    </button>
</template>

<script setup>
import { study, configs, currentConfigIndex } from '~/public/script/reactive';

let hasChanged = false;
let lastConfig = JSON.stringify(study);

//used for keeping track of the previous configs
configs.value = [];

//used for checking if a change has been made
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

//fixes so the current config of "study" is updated to the targeted item in the config
const changer = (other) => {
    study.title = other.title;
    study.description = other.description;
    study.closingMethod = other.closingMethod;
    study.closingLimit = other.closingLimit;
    study.desiredResponses = other.desiredResponses;
    study.demographicReq = other.demographicReq;
    study.customTerms = other.customTerms;
    study.questions = other.questions;
}

const cloneConfig = () => {
    //clone the current config
    const currentConfig = JSON.parse(JSON.stringify(study));

    //make sure that it does not push into beginning of the array if the current config is the same as the first item in the array
    if (configs.value[0] && equal(configs.value[0].study, currentConfig)) return;

    //create a backup
    const backup = { time: Date.now(), study: JSON.parse(JSON.stringify(study)) };

    //input to front of array
    configs.value.unshift(backup)

    //set to false as change has been made
    hasChanged = false;
}

cloneConfig();

//function for handling if the current change is being done not at the beginning of the array
const manageMiddleDiff = () => {
    //copy the current config
    const currentConfig = JSON.parse(JSON.stringify(study));

    //remove earlier items in the array
    configs.value.splice(0, currentConfigIndex.value);

    //reset number of the index used
    currentConfigIndex.value = 0;

    //check that there has been done a change
    if (!equal(configs.value[0]?.study, currentConfig)) configs.value.unshift({ time: Date.now(), study: currentConfig });

    //set to false as the change has been done now
    hasChanged = false;
}

//handles changing which item in the "configurations" array is currently displayed
const controller = (change) => {

    const currentConfig = JSON.stringify(study);

    //purpose: To make sure the current config is backed up if going back before the 
    // config has been saved: so that current config can be returned to
    if (change > 0 && currentConfig !== lastConfig && hasChanged) {
        configs.value.unshift({ time: Date.now(), study: JSON.parse(JSON.stringify(study)) });
    }

    //makes sure that user cannot go back, make a change before a backup is done and click redo to get the config before clicking "undo"
    if (change < 0 && currentConfig !== lastConfig && hasChanged) return;


    const i = currentConfigIndex.value + change;

    //return if item does not exist
    if (!configs.value[i]) return;

    //update the index
    currentConfigIndex.value += change;

    //copy the other other configuration (the one to swap to)
    const otherConfig = JSON.parse(JSON.stringify(configs.value[i]));

    //call function to change into other config
    if (otherConfig && otherConfig?.study) changer(otherConfig?.study);

    //update variable holding config used for comparing in setInterval
    lastConfig = JSON.stringify(study);

    hasChanged = false;
}

//keeps watching if any changes has been done to the "study" object
watch(
    () => study,
    //set to true if changes have been made
    () => { hasChanged = true },
    { deep: true }
);


//Every 3 seconds, it checks if there has been made any change to the configuration
const interval = setInterval(() => {
    if (!study?.id) {
        clearInterval(interval)
        return;
    };

    if (hasChanged) {
        //saved for comparisment
        const currentConfig = JSON.stringify(study);

        //if it is at the latest version, call "cloneConfig" to push to the front of the array
        if (currentConfigIndex.value === 0) cloneConfig();

        //if it is not at the latest version/config item in the configArray, it 
        // check if changes have been made, and calls "manageMiddleDiff" if true
        else if (currentConfig !== lastConfig) manageMiddleDiff();
    }
}, 3000);

</script>

<style scoped>
@import url('public/style/components/dashboard/dashboard-header.scss');
</style>