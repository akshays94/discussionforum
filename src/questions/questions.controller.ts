import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from "@nestjs/common";
import { QuestionsService } from './questions.service';
import { Question } from './question.interface';
import { AuthGuard } from "@nestjs/passport";
import { CreateQuestionDto } from './create-question.dto';

@Controller('questions')
export class QuestionsController {
    
    constructor(private readonly questionsService: QuestionsService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createNewQuestion(
        @Body() body: CreateQuestionDto,
        @Req() request
    ) {
        return await this.questionsService.createNewQuestion(body, request);
    }


    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllQuestions(): Promise<Question[]> {
        return await this.questionsService.getAllQuestions()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getSingleQuestion(
        @Param('id') userId: string
    ): Promise<Question> {
        return await this.questionsService.getSingleQuestion(userId);
    }

}