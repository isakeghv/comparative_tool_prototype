// initial 'Participant' only need id as the other relevant data is default
const createParticipant = async (studyId) => {
    try {
        const response = await fetch('/api/participants', {
            method: 'POST',
            body: JSON.stringify({
                study: studyId
            }),
            headers: {
                'Content-Type': 'application/json',
            }  
        })

        if (!response.ok) {
            throw new Error(`Failed to create participant session: ${response.statusText}`);
        }

        const participant = await response.json();
      
        // return id of participant for storing answers later
        return participant.id; 
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const updateParticipant = async (participantId, data) => {
    try {
        const response = await fetch(`/api/participants/${participantId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }  
        })

        if (!response.ok) {
            throw new Error(`Failed to update participant session: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

const deleteParticipant = async () => {
    // fill it out later idk 
}

const ParticipantService = {
    createParticipant,
    updateParticipant
}

export default ParticipantService;