// send a POST request to the /studies endpoint
// get the id from 'user' that was set when user logged in, and send it to the API endpoint to reference the user as the creator
const createStudy = async (data, userId) => {
    try {
        const response = await fetch('/api/studies', {
            method: 'POST',
            body: JSON.stringify({
                ...data,
                user: userId
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to create study: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error(err); // update later am zzz
    }
}

// id is saved in a reactive variable, and therefore don't need to send it through request parameters
const fetchStudy = async (studyId) => {
    try {
        const response = await fetch(`/api/studies/${studyId}`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`Failed to read study: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

// send a PUT request to update the existing resource by replacing it
const updateStudy = async (studyId, data) => {
    // need to remove `_id` from the rest of the fields due to it being immutable
    const { _id, ...studyData } = data;

    try {
        const response = await fetch(`/api/studies/${studyId}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...studyData
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to update study: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

export const deleteStudy = async (studyId) => {
    try {
        const response = await fetch(`/api/studies/${studyId}`, {
            method: 'DELETE'
        })


        if (!response.ok) {
            return { success: false, message: 'Unable to delete study' }
        }
        return { success: true }
    } catch (err) {
        console.error(err);
        return { success: false, message: 'Unable to delete study' }
    }
}

export const updateStudyStatus = async (studyId, status) => {
    try {
        const response = await fetch(`/api/studies/${studyId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({
                status: status
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            return { success: false }
        }

        const result = await response.json();

        return { success: true, result }
    } catch (err) {
        console.error(err);
        return { success: false }
    }
}

const StudyService = {
    createStudy,
    fetchStudy,
    updateStudy,
    deleteStudy,
    updateStudyStatus
};


export default StudyService;