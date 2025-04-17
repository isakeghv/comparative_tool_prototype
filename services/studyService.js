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
const updateStudy = async (studyId, questions) => {
    try {
        const response = await fetch(`/api/studies/${studyId}`, {
            method: 'PUT',
            body: JSON.stringify({
                questions
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
        console.error(err);
    }
}

const deleteStudy = async (studyId) => {
    try {
        const response = await fetch(`/api/studies/${studyId}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            throw new Error(`Failed to delete study: ${response.statusText}`);
        }
    } catch (err) {
        console.error(err);
    }
}

const publishStudy = async (studyId) => {
    try {
        const response = await fetch(`/api/studies/${studyId}/publish`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to publish study: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

const closeStudy = async (studyId) => {
    try {
        const response = await fetch(`/api/studies/${studyId}/close`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to close study: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.error(err);
    }
}

const StudyService = {
    createStudy,
    fetchStudy,
    updateStudy,
    deleteStudy,
    publishStudy,
    closeStudy
};


export default StudyService;