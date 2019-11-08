import * as mongoose from 'mongoose';

export const QuestionCommentSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, 'question ID is mandatory']
    },
    content: {
        type: String,
        required: [true, 'content is mandatory']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'createdBy is mandatory']
    }
}, {
    timestamps: true
})