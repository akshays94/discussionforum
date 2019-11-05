import { Module } from "@nestjs/common";
import { QuestionsController } from "./questions.controller";
import { QuestionsService } from "./questions.service";
import { MongooseModule } from "@nestjs/mongoose";
import { QuestionSchema } from "../schemas/question.schema";
import { AnswerSchema } from "../schemas/answer.schema";
import { QuestionCommentSchema } from "../schemas/question-comment.schema";
import { AnswerCommentSchema } from "../schemas/answer-comment.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Question', schema: QuestionSchema },
            { name: 'Answer', schema: AnswerSchema },
            { name: 'QuestionComment', schema: QuestionCommentSchema },
            { name: 'AnswerComment', schema: AnswerCommentSchema }
        ])
    ],
    controllers: [QuestionsController],
    providers: [QuestionsService]
})
export class QuestionsModule {}