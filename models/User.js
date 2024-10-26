import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: {
        type: String, 
        required: true
    },

    profileImageUrl: {
        type: String, 
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String, 
        required: true
    },

    phonenumber:{
        type: String
    },

});

export const User = mongoose.model('User', userSchema)