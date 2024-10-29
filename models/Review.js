import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema({

    author_id: {
        type: Schema.Types.ObjectId, ref: 'User', 
    },

    movie_id: {
        type: Schema.Types.ObjectId, ref: 'Movie', 
    },

    rating: {
        type: Number,
        required: true,
    },

    review: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

});

export const Review = mongoose.model('Review', reviewSchema)