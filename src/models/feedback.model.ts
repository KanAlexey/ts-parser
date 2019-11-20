import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    author: String,
    body: String,
    rating: Number,
    rated_at: Date,
    answers: [String],
    updated_at: Date
});

export const Feedback = mongoose.model("Feedback", FeedbackSchema);