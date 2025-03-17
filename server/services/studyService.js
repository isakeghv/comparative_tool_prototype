export const StudyService = {
    // send a POST request to the 'studies' endpoint
    // get the id from 'user' that was set when user logged in, and send it to the API endpoint to reference the user as the creator
    async createStudy(studyData, userId) {
        const response = await fetch('/api/studies', {
            method: 'POST',
            body: JSON.stringify({
                ...studyData,
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
    },

    // send a PUT request to update the existing resource by replacing it
    async updateStudy(updatedData) {
            if (!updatedData.id) {
                throw new Error("Study ID is required to update the study.");
            }   

        const response = await fetch('/api/studies', {
            method: 'PUT',
            body: JSON.stringify({
                ...updatedData
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to update study: ${response.statusText}`);
        }
    
        return await response.json();
    }
};
