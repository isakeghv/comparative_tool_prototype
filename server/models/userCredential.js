import mongoose from 'mongoose';
const { Schema } = mongoose;

const userCredentialSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: true,
        // validate the password at the backend as well -> can send the message to the frontend
        minlength: [8, 'Password must be at least 8 characters long.'],
    } 
});

export const userCredential = mongoose.model('UserCredential', userCredentialSchema);

