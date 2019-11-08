import { Injectable, NotFoundException, HttpException, HttpStatus, UnprocessableEntityException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Question } from './question.interface';
import { Answer } from './answer.interface';
import { QuestionComment } from './question-comment.interface';
import { User } from '../users/user.interface';
import { CreateQuestionDto } from './create-question.dto';
import * as mongoose from 'mongoose';
import { resolve } from "url";


@Injectable()
export class QuestionsService {
    
    constructor(
        @InjectModel('Question') private readonly questionModel: Model<Question>,
        @InjectModel('Answer') private readonly answerModel: Model<Answer>,
        @InjectModel('QuestionComment') private readonly questionCommentModel: Model<QuestionComment>,
        @InjectModel('User') private readonly userModel: Model<User>
    ){}


    async getAllQuestions() {
        return await 
            this.questionModel
                .find()
                .populate('createdBy')
                .populate('comments')
                .lean();

    }


    async getSingleQuestion(userId: string) {
        let question;
        try {
            question =  await this.questionModel
                            .findOne({ _id: userId })
                            .populate('createdBy')
                            .populate('comments')
                            .lean()
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

            let createdBy = await this.userModel.findOne({
                _id: request.user.userId
            })

            const newQuestionParams: CreateQuestionDto = {
                title: newQuestion.title,
                content: newQuestion.content,
                createdBy: createdBy._id
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

        let question = await this.questionModel.findOne({ _id: questionId })
        let createdBy = await this.userModel.findOne({ _id: request.user.userId })

        try {

            const newAnswerParams = {
                questionId: question._id,
                content: newAnswer.content,
                createdBy: createdBy._id
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
    ) {
        let question = await this.questionModel.findOne({ _id: questionId })

        return await 
            this.answerModel
                .find({ questionId: question._id})
                .populate('createdBy')
                .populate('questionId')
                .lean();
    }

    async createQuestionComment(
        questionId: string,
        newComment,
        request
    ) {

        let question = await this.questionModel.findOne({ _id: questionId })
        let createdBy = await this.userModel.findOne({ _id: request.user.userId })

        try {

            const newCommentParams = {
                questionId: question._id,
                content: newComment.content,
                createdBy: createdBy._id
            }
            let createdQuestionComment = new this.questionCommentModel(newCommentParams);
            createdQuestionComment = await createdQuestionComment.save();

            question.comments.push(createdQuestionComment);
            question.save();
            
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
    ) {
        let question = await this.questionModel.findOne({ _id: questionId })

        return await this.questionCommentModel
                        .find({ questionId: question._id })
                        .populate('createdBy')
                        .populate('questionId')
                        .lean();
    }



}