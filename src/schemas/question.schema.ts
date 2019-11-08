import * as mongoose from 'mongoose';
import * as uniqueValidator from 'mongoose-unique-validator';

export const QuestionSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true,
        unqiue: true,
        required: [true, 'question title cannot be blank']
    },
    content: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionComment' 
        }
    ]
}, {
    timestamps: true // creates: createdAt and updatedAt
})
 
QuestionSchema.plugin(uniqueValidator, { message: 'is already taken' })