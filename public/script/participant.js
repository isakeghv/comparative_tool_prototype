import { reactive } from 'vue';

// store id to know which participant to store id to
export const participantId = reactive({
    id: null,
})

//used to store the answers of the participant
export const participantAnswer = reactive({
    demographic: {},
    // planning to fix later...
    // questions: []
})