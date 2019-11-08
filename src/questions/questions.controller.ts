import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from "@nestjs/common";
import { QuestionsService } from './questions.service';
import { Question } from './question.interface';
import { Answer } from './answer.interface';
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
    @Post(':questionId/answers')
    async createNewAnswer(
        @Param('questionId') questionId: string,
        @Body() body: { content: string },
        @Req() request
    ) {
        return await this.questionsService.createNewAnswer(questionId, body, request);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':questionId/comments')
    async createNewComment(
        @Param('questionId') questionId: string,
        @Body() body: { content: string },
        @Req() request
    ) {
        let newComment = await this.questionsService.createQuestionComment(questionId, body, request);
        let { _id, content, createdAt, updatedAt, createdBy } 
                = newComment;
        return {
            id: _id,
            content, createdAt, updatedAt,
            createdBy: {
                id: createdBy._id,
                username: createdBy.username,
                email: createdBy.email
            }
        } 
    }


    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllQuestions() {
        let questions = await this.questionsService.getAllQuestions();

        return questions.map(question => {
            let { _id, title, content, createdAt, updatedAt, createdBy, comments } 
                = question;
                
            if (comments) {
                comments = comments.map(comment => {
                    let { _id, content, createdAt, updatedAt, createdBy } = comment;
                    return {
                        id: _id,
                        content, createdAt, updatedAt,
                        createdBy: {
                            id: createdBy._id,
                            username: createdBy.username,
                            email: createdBy.email
                        }
                    }
                })    
            }    
                
            return {
                id: _id,
                title, content, createdAt, updatedAt,
                comments,
                createdBy: {
                    id: createdBy._id,
                    username: createdBy.username,
                    email: createdBy.email
                }
            }
        })
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getSingleQuestion(
        @Param('id') userId: string
    ) {
        let question =  await this.questionsService.getSingleQuestion(userId);
        let { _id, title, content, createdAt, updatedAt, createdBy, comments } 
            = question;
            
        if (comments) {
            comments = comments.map(comment => {
                let { _id, content, createdAt, updatedAt, createdBy } = comment;
                return {
                    id: _id,
                    content, createdAt, updatedAt,
                    createdBy: {
                        id: createdBy._id,
                        username: createdBy.username,
                        email: createdBy.email
                    }
                }
            })    
        } 

        return {
            id: _id,
            title, content, createdAt, updatedAt,
            createdBy: {
                id: createdBy._id,
                username: createdBy.username,
                email: createdBy.email
            },
            comments
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':questionId/answers')
    async getAllAnswers(
        @Param('questionId') questionId: string 
    ) {
        let answers = await this.questionsService.getAllAnswers(questionId)
        return answers.map(answer => {
            let { _id, content, createdAt, updatedAt, createdBy, questionId } 
                = answer;
            return {
                id: _id,
                content, createdAt, updatedAt,
                createdBy: {
                    id: createdBy._id,
                    username: createdBy.username,
                    email: createdBy.email
                },
                question: {
                    id: questionId._id,
                    title: questionId.title
                }
            }   
        });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':questionId/comments')
    async getAllQuestionComments(
        @Param('questionId') questionId: string 
    ) {
        let comments = await this.questionsService.getAllQuestionComments(questionId)
        return comments.map(comment => {
            let { _id, content, createdAt, updatedAt, createdBy, questionId } 
                = comment;
            return {
                id: _id,
                content, createdAt, updatedAt,
                createdBy: {
                    id: createdBy._id,
                    username: createdBy.username,
                    email: createdBy.email
                },
                question: {
                    id: questionId._id,
                    title: questionId.title
                }
            } 
        })
    }

}