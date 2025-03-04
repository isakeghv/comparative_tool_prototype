import mongoose from 'mongoose';
const { Schema } = mongoose;

const userProfileSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // reference so a userProfile will always be linked to its userCredential document
    userCredential: { type: mongoose.Schema.Types.ObjectId, ref: 'UserCredential' }
});

export const userProfile = mongoose.model('UserProfile', userProfileSchema);
