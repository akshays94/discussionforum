import * as mongoose from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

export const QuestionCommentSchema = new mongoose.Schema({
    commentId: mongoose.Schema.Types.ObjectId,
    content: {
        type: String,
        required: [true, 'question comment is mandatory'],
    }
})

export const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true,
        unqiue: true,
        required: [true, 'question title cannot be blank']
    },
    content: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    comments: [QuestionCommentSchema]
}, {
    timestamps: true // creates: createdAt and updatedAt
})
 
QuestionSchema.plugin(uniqueValidator, { message: 'is already taken' })