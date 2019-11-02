import { Controller, Get, Post, Body, Param, Patch, Delete } from "@nestjs/common";
import { QuestionsService } from './questions.service';
import { Question } from './question.model';

@Controller('questions')
export class QuestionsController {
    
    constructor(private readonly questionsService: QuestionsService) {}

    @Get()
    getQuestions(): Question[] {
        return this.questionsService.getQuestions()
    }

    @Get(':id')
    getSingleQuestion(
        @Param('id') questionID: string): Question {
        return this.questionsService.getSingleQuestion(questionID)    
    }

    @Post()
    createNewQuestion(
        @Body('title') questionTitle: string, 
        @Body('content') questionContent: string): { id: string } {
        const newId =  this.questionsService.createNewQuestion(questionTitle, questionContent);
        return {
            id: newId
        };
    }

    @Patch(':id')
    updateQuestion(
        @Param('id') questionID: string,
        @Body() body: { title: string, content: string }): Question {
        let { title, content } = body;
        return this.questionsService.updateQuestion(questionID, title, content)
    }

    @Delete(':id')
    deleteQuestion(@Param('id') questionID: string): Question {
        return this.questionsService.deleteQuestion(questionID);
    }

}