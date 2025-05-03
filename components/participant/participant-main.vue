<template>
    <main v-if="!isSent" class="participant__cont">
        <ParticipantDemographics v-if="showDemographics && adjustedQuestionIdx === -1" :study=study />
        <ParticipantQuestions  v-else-if="adjustedQuestionIdx >= 0 && adjustedQuestionIdx < questions.length" :questions="questions" :questionIndex="adjustedQuestionIdx" />

        <div class="participant__navigation">
            <button @click="prevQuestion" v-if="questionIndex !== 0" class="participant__button participant__button--back font-small font-semi">Back</button>
            <!-- show 'send' button if question index is at the last step -->
            <button @click="sendForm"  v-if="questionIndex === totalSteps - 1" class="participant__button participant__button--send font-small font-semi">Send</button>
            <button @click="nextQuestion" v-else class="participant__button participant__button--next font-small font-semi">Next</button>
        </div>
    </main>
    <main v-else class="participant__cont participant__cont--intro">
        <div class="participant__section">
            <h2 class="participant__title font-h4 font-semi">Thank you for completing the study.</h2>
            <p>Your participation is greatly appreciated, and your input will help us move forward with our research.</p>
        </div>
        <div class="participant__section">      
            <button @click="downloadData" class="participant__button participant__button--start font-small font-semi">Download your answers</button>
        </div>
    </main>
</template>

<script setup>
// need to emit progress so progress bar know which question you're at, and to calculate the percentage of each step
const emit = defineEmits(['updateProgress', 'totalSteps', 'participantDone']);
import ParticipantService from '../../services/participantService';
import { participantId, participantAnswer } from '../../public/script/participant';
import { ref, computed, toRaw } from 'vue'

// import { exportAsJson } from '#imports';

const props = defineProps({
    study: Object
});

const isSent = ref(false);
const participantResult = ref(null);

// store the questions array
const questions = computed(() => props.study?.questions || []);

// track the index, starting at 0
const questionIndex = ref(0);

// show demographics if at minimum one question is requested
const showDemographics = computed(() => {
    return props.study.demographic.some(question => question.request === true);
});

// total steps of study, that included demographics (if required) + total questions
const totalSteps = computed(() => {
    // add one extra step if `demographicReq` is true
    const demographicsStep = (showDemographics.value && props.study?.demographicReq) ? 1 : 0;
    const allSteps = (questions.value?.length || 0) + demographicsStep;
    emit('totalSteps', allSteps);
    return allSteps;
});

// have to adjust the question indexing based on `demographicReq` (starts on -1 if it's true)
const adjustedQuestionIdx = computed(() => {
    return (showDemographics.value && props.study?.demographicReq) ? questionIndex.value - 1 : questionIndex.value;
});

// if current question index is not larger than the index of the last question, increment to "move forward"
const nextQuestion = () => {
    if (questionIndex.value < totalSteps.value - 1) {
        questionIndex.value++;
        emit('updateProgress', questionIndex.value);
    }
};

const prevQuestion = () => {
    if (questionIndex.value > 0) {
        questionIndex.value--;
        emit('updateProgress', questionIndex.value);
    }
};

// TODO: send form if required fields are filled etc.
const sendForm = async () => {
    //turning into array, so response can be iterated; map so it fits structure of schema
    const questions = Object.entries(participantAnswer)
    .filter(([id]) => id !== 'demographic')
    .map(([id, answers]) => {
        // need to unwrap it from the reactive array (originally stored as an proxy object)
        const rawAnswers = toRaw(answers);

        return {
            id,
            answer: Object.values(rawAnswers)
        };
    });

    //creating response-object
    const participantResponse = {};

    //making sure that it has "questions"
    if (!participantResponse.questions) participantResponse.questions = [];

    //iterating array created earlier. Used to make sure response is given in the correct format
    questions.forEach(question =>{
        //only inserting if it is not demographics
        participantResponse.questions[question.id] = question.value;
    })


    // also need to map the demographic queestions
    const demographic = Object.entries(participantAnswer.demographic).map(([id, demographicAnswer]) => {
        return { id: id, answer: toRaw(demographicAnswer) };
    });

    // combine demographic answers with main questions
    participantResponse.demographic = demographic;
    participantResponse.questions = questions;

    // send participant study and update participant ->  should status to 'completed brb
    const updateSession = await ParticipantService.updateParticipant(participantId.id, participantResponse);

    // if successful, switch to completion study page
    if (updateSession.updated) {
        isSent.value = true;
        participantResult.value = updateSession.result;
        emit('participantDone');
    }
}

const downloadData = () => {
    // const answers = Object.entries(participantAnswer);
    // console.log(answers);
    // exportAsJson(answers);    

    const rawData = toRaw(participantResult.value); 
    const str = JSON.stringify(rawData, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const element = document.createElement('a');
      
    element.href = URL.createObjectURL(blob);
    element.download = "answers.json";
  
    // trigger the download, then remove the element after downloading
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

</script>

<style scoped>
    @import url('public/style/pages/participant/participant.scss');
</style>
