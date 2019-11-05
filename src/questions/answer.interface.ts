export interface Answer {
    _id: number;
    questionId: string,
    content: string;
    createdBy: string;
    isCorrectAnswer: boolean;
}