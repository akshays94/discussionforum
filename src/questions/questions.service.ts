import { Injectable, NotFoundException, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Question } from './question.interface';
import { CreateQuestionDto } from './create-question.dto';
import * as mongoose from 'mongoose';


@Injectable()
export class QuestionsService {
    
    constructor(
        @InjectModel('Question') private readonly questionModel: Model<Question>
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



}