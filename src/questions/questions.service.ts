import { Injectable, NotFoundException } from "@nestjs/common";
import { Question } from './question.model';

@Injectable()
export class QuestionsService {
    
    private questions: Question[] = [];

    createNewQuestion(title: string, content: string): string {
        const ID = Math.random().toString();
        const newQuestion = new Question(ID, title, content);
        this.questions.push(newQuestion);
        return ID;
    }

    getQuestions(): Question[] {
        return [...this.questions]
    }

    private findQuestion(questionID: string): Question {
        const question = this.questions.find(question => question.id === questionID);
        if (!question) {
            throw new NotFoundException('question not found');
        }
        return question;
    }

    private findQuestionIndex(questionID: string): number {
        const questionIndex = this.questions.findIndex(question => question.id === questionID);
        if (questionIndex === -1) {
            throw new NotFoundException('question not found');
        }
        return questionIndex;
    }

    getSingleQuestion(questionID: string): Question {
        const question = this.findQuestion(questionID);
        return {...question};
    }

    updateQuestion(
        questionID: string, 
        title: string, 
        content: string): Question {

        const question = this.findQuestion(questionID);
        question['title'] = title;
        question['content'] = content;
        return {...question};
    
    }

    deleteQuestion(questionID: string): Question {
        const questionIndex = this.findQuestionIndex(questionID);
        const question = this.questions[questionIndex];
        this.questions.splice(questionIndex, 1);
        return question;
    }



}