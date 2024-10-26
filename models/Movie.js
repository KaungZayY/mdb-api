import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({

    title: {
        type: String, 
        required: true
    },

    imageUrl: {
        type: String, 
        required: true
    },

    studio: {
        type: String, 
        required: true
    },

    runningtime: {
        type: Number, 
        required: true
    },

    genre:[{
        type: String
    }],

    diretor: {
        type: String, 
        required: true
    },

    year: {
        type: Number, 
        required: true
    },

});

export const Movie = mongoose.model('Movie', movieSchema)