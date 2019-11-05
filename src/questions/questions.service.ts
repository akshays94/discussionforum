import { Injectable, NotFoundException, HttpException, HttpStatus, UnprocessableEntityException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Question } from './question.interface';
import { Answer } from './answer.interface';
import { QuestionComment } from './question-comment.interface';
import { CreateQuestionDto } from './create-question.dto';
import * as mongoose from 'mongoose';


@Injectable()
export class QuestionsService {
    
    constructor(
        @InjectModel('Question') private readonly questionModel: Model<Question>,
        @InjectModel('Answer') private readonly answerModel: Model<Answer>,
        @InjectModel('QuestionComment') private readonly questionCommentModel: Model<QuestionComment>,
    ){}


    async getAllQuestions(): Promise<Question[]> {
        return await this.questionModel.find().exec();
    }


    async getSingleQuestion(userId: string): Promise<Question> {
        let question;
        try {
            question =  await this.questionModel.findOne({ _id: userId })
        } catch (error) {
            throw new HttpException(error._message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
            
        if (!question) {
            throw new NotFoundException('Question not found')
        }
        return question;
    }

    
    async createNewQuestion(newQuestion: CreateQuestionDto, request) {
        try {
            
            const newQuestionParams: CreateQuestionDto = {
                title: newQuestion.title,
                content: newQuestion.content,
                createdBy: mongoose.Types.ObjectId(request.user.userid)
            }
            const createdQuestion = new this.questionModel(newQuestionParams)
            return await createdQuestion.save()

        } catch (error) {
            console.log(error)
            if (error.name === 'ValidationError') {
                const message = error._message;
                throw new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY)
            }
        }
    }

    async createNewAnswer(
        questionId: string, 
        newAnswer: { content: string },
        request
    ) {

        const isValidId = mongoose.Types.ObjectId.isValid(questionId);
        if (!isValidId) {
            throw new UnprocessableEntityException('Invalid question id')
        }

        const questionCount =  await this.questionModel.countDocuments({ _id: questionId })
        if (questionCount === 0) {
            throw new NotFoundException('question id not found')
        }

        try {

            const newAnswerParams = {
                questionId: mongoose.Types.ObjectId(questionId),
                content: newAnswer.content,
                createdBy: mongoose.Types.ObjectId(request.user.userId)
            }
            const createdAnswer = new this.answerModel(newAnswerParams)
            return await createdAnswer.save()
            
        } catch (error) {
            
            console.log(error);
            if (error.name === 'ValidationError') {
                const message = error._message;
                throw new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY)
            }
        }

    }

    async getAllAnswers(
        questionId: string
    ): Promise<Answer[]> {
        const isValidId = mongoose.Types.ObjectId.isValid(questionId);
        if (!isValidId) {
            throw new UnprocessableEntityException('Invalid question id')
        }

        const questionCount =  await this.questionModel.countDocuments({ _id: questionId })
        if (questionCount === 0) {
            throw new NotFoundException('question id not found')
        }

        return await this.answerModel.find({
            questionId: questionId
        }).exec();
    }

    async createQuestionComment(
        questionId: string,
        newComment,
        request
    ) {

        const isValidId = mongoose.Types.ObjectId.isValid(questionId);
        if (!isValidId) {
            throw new UnprocessableEntityException('Invalid question id')
        }

        const questionCount =  await this.questionModel.countDocuments({ _id: questionId })
        if (questionCount === 0) {
            throw new NotFoundException('question id not found')
        }

        try {

            const newCommentParams = {
                questionId: mongoose.Types.ObjectId(questionId),
                content: newComment.content,
                createdBy: mongoose.Types.ObjectId(request.user.userId)
            }
            const createdQuestionComment = new this.questionCommentModel(newCommentParams);
            await createdQuestionComment.save();
            
            const newQuestionCommentItem = {
                commentId: createdQuestionComment._id,
                content: createdQuestionComment.content
            }
            await this.questionModel.update(
                { _id: questionId },
                { $push: { comments: newQuestionCommentItem } }
            )

            return createdQuestionComment;
        } catch (error) {
            
            console.log(error);
            if (error.name === 'ValidationError') {
                const message = error._message;
                throw new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY)
            }
        }

    }

    async getAllQuestionComments(
        questionId: string
    ): Promise<Answer[]> {
        const isValidId = mongoose.Types.ObjectId.isValid(questionId);
        if (!isValidId) {
            throw new UnprocessableEntityException('Invalid question id')
        }

        const questionCount =  await this.questionModel.countDocuments({ _id: questionId })
        if (questionCount === 0) {
            throw new NotFoundException('question id not found')
        }

        return await this.questionCommentModel.find({
            questionId: questionId
        }).exec();
    }



}