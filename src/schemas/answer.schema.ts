import * as mongoose from 'mongoose';

export const AnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'question ID is mandatory']
    },
    content: {
        type: String,
        required: [true, 'content is mandatory']
    },
    isCorrectAnswer: {
        type: Boolean,
        default: false
    },
    createdBy: mongoose.Schema.Types.ObjectId
}, {
    timestamps: true
})