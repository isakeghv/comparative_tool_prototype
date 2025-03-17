import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserCredentialSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        // validate the password at the backend as well -> can send the message to the frontend
        minlength: [8, 'Password must be at least 8 characters long.'],
    },
    // reference so a userCredential will always be linked to its userProfile document
    userProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true }
})

const UserProfileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
});


export const UserCredential = mongoose.model('UserCredential', UserCredentialSchema);
export const UserProfile = mongoose.model('UserProfile', UserProfileSchema)

