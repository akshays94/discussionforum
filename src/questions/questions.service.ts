import { Injectable } from '@nestjs/common';
import { Question } from './interfaces/question.interface';

@Injectable()
export class QuestionsService {
  
  private readonly QUESTIONS: Question[] = [];

  createQuestion(newQuestion: Question) {
    this.QUESTIONS.push(newQuestion);
  }  

  findAllQuestions(): Question[] {
    return this.QUESTIONS;
  }

}
