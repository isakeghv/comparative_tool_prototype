import mongoose from 'mongoose';
const { Schema } = mongoose;

// basic user schema (will look into it more later)
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, },
    lastName: { type: String, required: true, },
    email: { type: String, required: true, },
    password: { type: String, required: true, } // will be hashed
});

const User = mongoose.model('User', userSchema);

module.exports = User;
