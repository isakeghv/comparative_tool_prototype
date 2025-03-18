export const StudyService = {
    // send a POST request to the /studies endpoint
    // get the id from 'user' that was set when user logged in, and send it to the API endpoint to reference the user as the creator
    async createStudy(data, userId) {
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
            console.log(err); // update later am zzz
        }
    },

    // id is saved in a reactive variable, and therefore don't need to send it through request parameters
    async fetchStudy(studyId) {
        try {
        const response = await fetch(`/api/studies/${studyId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to read study: ${response.statusText}`);
        }

        return await response.json();
        } catch (err) {
            console.log(err); // update later am zzz
        }
    },

    // send a PUT request to update the existing resource by replacing it
    async updateStudy(studyId, data) {
        try {
            const response = await fetch(`/api/studies/${studyId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...data
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
            console.log(err); // update later am zzz
        }
    }

    // async deleteStudy(studyId) {

    // }
};
