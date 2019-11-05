import * as mongoose from 'mongoose';

export const AnswerCommentSchema = new mongoose.Schema({
    answerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'answer ID is mandatory']
    },
    content: {
        type: String,
        required: [true, 'content is mandatory']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'createdBy is mandatory']
    }
}, {
    timestamps: true
})