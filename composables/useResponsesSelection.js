export function useResponsesSelection(responses, idRef, initialView = 'all') {
    // default view mode for responses
    const selectedView = ref(initialView);
    const participantNum = ref(responses?.length > 0 ? 1 : 0);

    // store the participant number in a ref on emit, and use it to access the `studyResponses` array
    const handleParticipantUpdate = (number) => {
        participantNum.value = number;
    }

    // send current answer information of question to be rendered
    const questionResponse = computed(() => {
        if (selectedView.value !== 'individual') return null;
        if (participantNum.value < 1 || participantNum.value > responses.length) return null;

        // get the correct participant asked for, -1 due to zero-indexing
        const participant = responses[participantNum.value - 1];
        const map = {};

        participant.questions.forEach((q) => {
            if (q.id) map[q.id] = q.answer;
        });

        // map it to a hashtable, and access it with `props.id` (if it exists)
        return map[idRef.value] ? map[idRef.value] : [];
    });

    // get all demographic responses of a participant
    const demoResponse = computed(() => {
        if (selectedView.value !== 'individual') return null;
        if (participantNum.value < 1 || participantNum.value > responses.length) return null;
    
        const participant = responses[participantNum.value - 1];
        const demographic = participant.demographic;
    
        if (!Array.isArray(demographic)) return {};
    
        const map = {};
        demographic.forEach((entry) => {
            if (entry.id) map[entry.id] = entry.answer;
        });
    
        return map;
    });
    
    return {
        selectedView,
        handleParticipantUpdate,
        questionResponse,
        demoResponse
    };
}