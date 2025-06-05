import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserCredentialSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: [100, 'Email must not exceed 100 characters.']
    },
    password: {
        type: String,
        required: true,
        // validate the password at the backend as well -> can send the message to the frontend
        minlength: [8, 'Password must be at least 8 characters long.'],
        maxlength: [100, 'Password must not exceed 100 characters.']
    },
    // reference so a userCredential will always be linked to its userProfile document
    userProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true }
})

const UserProfileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: [50, 'First name must not exceed 50 characters.']
    },
    lastName: {
        type: String,
        required: true,
        maxlength: [50, 'Last name must not exceed 50 characters.']
    },
});


export const UserCredential = mongoose.model('UserCredential', UserCredentialSchema);
export const UserProfile = mongoose.model('UserProfile', UserProfileSchema)

