import mongoose from 'mongoose';
const { Schema } = mongoose;

const userCredentialSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        // validate the password at the backend as well -> can send the message to the frontend
        minlength: [8, 'Password must be at least 8 characters long.'],
    },
    // reference so a userCredential will always be linked to its userProfile document
    userProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true }
});

const userProfileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});


export const userCredential = mongoose.model('UserCredential', userCredentialSchema);
export const userProfile = mongoose.model('UserProfile', userProfileSchema)

