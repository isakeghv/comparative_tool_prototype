<template>
    <header class="header">
        <h1 class="header__headline font-heavy font-h3">Compara</h1>
        <p class="header__paragraph font-h6" v-if="name && !study.id">
            Welcome, <span class="header__span font-h6 font-heavy">{{ name }}</span>!
        </p>
        <div class="header__container" v-if="study.id">
            <div class="header__buttons">
                <button class="header__button" data-tooltip="Save" @click="saveStudy()">
                    <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                        <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Z"/>
                    </svg>
                </button>
                <button class="header__button" data-tooltip="Preview">
                    <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                        <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"/>
                    </svg>
                </button>
                <button class="header__button" data-tooltip="Undo">
                    <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                        <path xmlns="http://www.w3.org/2000/svg" d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"/>
                    </svg>

                </button>
                <button class="header__button" data-tooltip="Redo">
                    <svg class="header__icon" viewBox="0 -960 960 960" xmlns="http://www.w3.org/2000/svg">
                        <path xmlns="http://www.w3.org/2000/svg" d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z"/>
                    </svg>

                </button>
                <button class="header__button" data-tooltip="Link">
                    <svg class="header__icon" viewBox="0 -960 960 960" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path xmlns="http://www.w3.org/2000/svg" d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z"/>
                    </svg>
                </button>
            </div>
            <button class="header__publish font-semi font-normal">Publish</button>
        </div>
    </header>
</template>

<script setup>
//importing reactive variable which holds the id of the study and where the study questions are stored
import { user, study, initialStudy } from '~/public/script/reactive';
const props = defineProps({
    name: String,
    id: String,
})

// flag to prevent creating study when saving multiple times
const isStudyCreated = ref(false);

// need to pass all the comparisons to pass it as true (probably should find a way to not repeat too much)
const compareStudy = () => {
    return JSON.stringify(study.questions) === JSON.stringify(initialStudy.questions) &&
           JSON.stringify(study.demographicReq) === JSON.stringify(initialStudy.demographicReq) &&
           JSON.stringify(study.demographic) === JSON.stringify(initialStudy.demographic) &&
           JSON.stringify(study.description) === JSON.stringify(initialStudy.description) &&
           JSON.stringify(study.title) === JSON.stringify(initialStudy.title)
};

const updateSaveHistory = () => {
    //saves it to "study.initial": 
    // - The "back" button prevents user from going back if the initial study-configuration is not
    //      similar to the current. Saving updates so the "initial" has the current setup, so the user can go back
    initialStudy.questions = JSON.parse(JSON.stringify(study.questions))
    initialStudy.demographicReq = JSON.parse(JSON.stringify(study.demographicReq))
    initialStudy.demographic = JSON.parse(JSON.stringify(study.demographic))
    initialStudy.description = JSON.parse(JSON.stringify(study.description))
    initialStudy.title = JSON.parse(JSON.stringify(study.title))
}

// send a POST request to the 'study' endpoint, and pass the user/title/desc data for saving (temporarily)
const createStudy = async () => {
    const response = await fetch('/api/study', {
        method: 'POST',
        body: JSON.stringify({
            'id': study.id,
            // get the id from const 'user' that was set when user logged in, and send it to the API endpoint to reference the user as the creator
            'user': user.info._id,
            'title': study.title,
            'description': study.description
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

  const result = await response.json();

    if (result.created) {
        const studyId = result.studyId;
    } else {
        console.log('Failed to create study');
    }
}

const updateStudy = async () => {
    const updatedData = {
        title: study.title,
        description: study.description
    }

    const response = await fetch('/api/study', {
        method: 'PUT',
        body: JSON.stringify({
            'id': study.id,
            updatedData
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

  const result = await response.json();

    if (result.updated) {
        const studyId = result.studyId;
    } else {
        console.log('Failed to update study');
    }
}

// when clicking on 'save', update the tracking of changes and create new study if it hasn't been created yet
const saveStudy = async () => {
    const noChanges = compareStudy();
    console.log(noChanges);

    // first update the tracking of the initial and current study
    updateSaveHistory();
    
    // if study gets created, update the flag to true
    if (!isStudyCreated.value) {
        isStudyCreated.value = true;
        return await createStudy();
    } else {
        console.log('already exists');
    }
    
    // prevent doing unecessary calls to db if no data has been changed
    if (!noChanges) {
        return await updateStudy();
    } else {
        console.log('no need to save')
    }
}
</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-header.scss');
</style>