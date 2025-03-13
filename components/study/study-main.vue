<template>
    <div class="study__container">
        <div class="study__main">
            <div class="study__header">
                <label for="study_question_input" class="study__label study__headline font-h5 font-semi">Question</label>
                <input type="text" class="study__input study__input--text font-h5 font-medium" id="study_question_input" v-model="config.question">
            </div>

            <div class="artifact">
                <h3 class="artifact__headline font-h5 font-semi">Artifacts</h3>
                <div class="artifact__container" v-for="(artifact, i) in config.artifacts">
                    <div class="wrapper">
                        <button class="wrapper__button" @click="selectMedia(artifact.source, artifact.id)">
                            <svg class="wrapper__icon" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.1899 7.99435C12.9946 8.18961 12.9946 8.50619 13.1899 8.70145C13.3852 8.89672 13.7017 8.89672 13.897 8.70145L13.1899 7.99435ZM21.3914 0.999988C21.3914 0.723846 21.1675 0.499988 20.8914 0.499988L16.3914 0.499989C16.1152 0.499989 15.8914 0.723846 15.8914 0.999989C15.8914 1.27613 16.1152 1.49999 16.3914 1.49999L20.3914 1.49999L20.3914 5.49999C20.3914 5.77613 20.6152 5.99999 20.8914 5.99999C21.1675 5.99999 21.3914 5.77613 21.3914 5.49999L21.3914 0.999988ZM13.897 8.70145L21.2449 1.35354L20.5378 0.646435L13.1899 7.99435L13.897 8.70145Z"
                                    fill="#444444" />
                                <path
                                    d="M13.1899 13.8968C12.9946 13.7015 12.9946 13.3849 13.1899 13.1897C13.3852 12.9944 13.7017 12.9944 13.897 13.1897L13.1899 13.8968ZM21.3914 20.8911C21.3914 21.1673 21.1675 21.3911 20.8914 21.3911L16.3914 21.3911C16.1152 21.3911 15.8914 21.1673 15.8914 20.8911C15.8914 20.615 16.1152 20.3911 16.3914 20.3911L20.3914 20.3911L20.3914 16.3911C20.3914 16.115 20.6152 15.8911 20.8914 15.8911C21.1675 15.8911 21.3914 16.115 21.3914 16.3911L21.3914 20.8911ZM13.897 13.1897L21.2449 20.5376L20.5378 21.2447L13.1899 13.8968L13.897 13.1897Z"
                                    fill="#444444" />
                                <path
                                    d="M8.7017 13.8968C8.89696 13.7015 8.89696 13.3849 8.7017 13.1897C8.50644 12.9944 8.18985 12.9944 7.99459 13.1897L8.7017 13.8968ZM0.500232 20.8911C0.500233 21.1673 0.72409 21.3911 1.00023 21.3911L5.50023 21.3911C5.77638 21.3911 6.00023 21.1673 6.00023 20.8911C6.00023 20.615 5.77637 20.3911 5.50023 20.3911L1.50023 20.3911L1.50023 16.3911C1.50023 16.115 1.27638 15.8911 1.00023 15.8911C0.72409 15.8911 0.500233 16.115 0.500233 16.3911L0.500232 20.8911ZM7.99459 13.1897L0.646679 20.5376L1.35379 21.2447L8.7017 13.8968L7.99459 13.1897Z"
                                    fill="#444444" />
                                <path
                                    d="M8.7017 7.99435C8.89696 8.18961 8.89696 8.50619 8.7017 8.70145C8.50644 8.89672 8.18985 8.89672 7.99459 8.70145L8.7017 7.99435ZM0.500232 0.999988C0.500233 0.723846 0.72409 0.499988 1.00023 0.499988L5.50023 0.499989C5.77638 0.499989 6.00023 0.723846 6.00023 0.999989C6.00023 1.27613 5.77637 1.49999 5.50023 1.49999L1.50023 1.49999L1.50023 5.49999C1.50023 5.77613 1.27638 5.99999 1.00023 5.99999C0.72409 5.99999 0.500233 5.77613 0.500233 5.49999L0.500232 0.999988ZM7.99459 8.70145L0.646679 1.35354L1.35379 0.646435L8.7017 7.99435L7.99459 8.70145Z"
                                    fill="#444444" />
                            </svg>
                        </button>
                        <button class="wrapper__button wrapper__button--radius">
                            <svg class="wrapper__icon" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="path-1-inside-1_0_1" fill="white">
                                    <path d="M2 3H13V18H2V3Z" />
                                </mask>
                                <path d="M2 3H13V18H2V3Z" fill="white" />
                                <path
                                    d="M13 18V19H14V18H13ZM2 18H1V19H2V18ZM12 3V18H14V3H12ZM13 17H2V19H13V17ZM3 18V3H1V18H3Z"
                                    fill="#444444" mask="url(#path-1-inside-1_0_1)" />
                                <line y1="2.5" x2="15" y2="2.5" stroke="#444444" />
                                <mask id="path-4-inside-2_0_1" fill="white">
                                    <path d="M4 0H11V3H4V0Z" />
                                </mask>
                                <path d="M4 0V-1H3V0H4ZM11 0H12V-1H11V0ZM4 1H11V-1H4V1ZM10 0V3H12V0H10ZM5 3V0H3V3H5Z"
                                    fill="#444444" mask="url(#path-4-inside-2_0_1)" />
                            </svg>
                        </button>
                    </div>
                    <img :src="artifact.source" :alt="artifact.id" class="artifact__image" v-if="isImage">
                    <div class="artifact__footer">
                        <p class="artifact__absolute" v-if="showInfo === i">All artifacts must have a unique identifier. You
                            can set one yourself (recomended), use the file-name of the uploaded file (recomended if
                            unique), or generate one by clicking the "generate unique id" button</p>
                        <div class="artifact__row">
                            <label :for="`artifact_id-${i}_input`" class="artifact__label">
                                <span class="artifact__span">Id:</span>
                            </label>
                            <span class="artifact__info" @mouseover="showInfo = i" @mouseleave="showInfo = null"
                                aria-label="information about id">?</span>
                            <input type="text" :id="`artifact_id-${i}_input`" class="artifact__input artifact__input--small"
                                v-model="artifact.id" :placeholder="!artifact.id ? 'Id is required' : ''">
                        </div>
                    </div>
                    <button class="artifact__button" @click="artifact.id = JSON.stringify(Date.now())">Generate unique
                        id</button>
                </div>

                <div class="artifact__container artifact__container--square">
                    <label for="study_file_input" class="artifact__add" aria-label="Choose file">
                        <svg class="artifact__plus" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 39.5H76M38 0V76" stroke="#444444" stroke-width="6" />
                        </svg>
                    </label>
                    <div class="artifact__footer artifact__footer--hidden">
                        <input type="file" name="" id="study_file_input" class="artifact__input artifact__input--file"
                            @change="uploadFile">
                    </div>
                </div>
            </div>
            <button class="overlay"v-if="selectedSource" @click="selectedSource = ''" aria-label="exit window"></button>
            <div class="expand" v-if="selectedSource">
                <button class="expand__button" @click="selectedSource = ''">Exit</button>
                <img :src="selectedSource" :alt="selectedId" class="expand__img" v-if="isImage(selectedSource)">
            </div>
        <!-- {{ study }} -->
        </div>
    </div>
    <Study-aside />
</template>

<script setup>
import { study } from '~/public/script/reactive';

const props = defineProps({
    index: Number,
    id: String,
})

const showInfo = ref(null)

const selectedSource = ref('');
const selectedId = ref('');

const selectMedia = (source, id)=>{
    selectedSource.value = source;
    selectedId.value = id
}

const isImage = (file) => {
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const extension = file.slice(file.lastIndexOf('.')).toLowerCase();
    return extensions.includes(extension);

}

//iterating array if id does not correspond with id of study located by index
const iterateArr = (id) => {
    for (let i = 0; i < study.questions.length; i++) {
        if (study.questions[i].id === id) return study.questions[i]
    }
    //returning null if not found
    return null
}

//returns the config of the question
const config = computed(() => {
    let question = study.questions[props.index]

    //returning question if found
    if (question.id === props.id) return question

    //returning question (or null if question cannot be found at all, 
    // neither with index nor id), if the one located with index is incorrect
    return iterateArr(props.id)
})

const uploadFile = async (e) => {
    const file = e.target.files[0];

    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const response = await $fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    if (!response.success) return alert('issues with upload, fix a proper custom prompt box to alert user');

    //pushing the content to the "artifacts" array
    config.value.artifacts.push({
        id: response.id,
        source: response.source
    })

    console.log(study);

    e.target.value = '';
};

/*
------------------
******************
------------------

NOTE!

In this component we need to be able to give the following options:
- Modify/write question question.
- upload artifact and give it a unique name (so multiple files do not have the same name), 
    but it should extract the initial file-name and first and place as "identifier" for the artifact (can be modifier later)
- set/change identifier name of artifact.
- Decide if question is required or not before moving to next question/submitting
- Selecting what type of response (multiple choise, drag and drop etc).
- Set response options (for multiple choise and drag-and drop)
- set minimum and max values for "range" option in "response-format"
- set closing-method (date, duration, replies)
- set the closing-limit


------------------
******************
------------------




*/

</script>

<style scoped>
    @import url('public/style/components/study/study-main.scss');
</style>