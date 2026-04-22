export interface AnswerItem {
  id: number;
  userId: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionItem {
  id: number;
  userId: number;
  nickname: string;
  title: string;
  content: string;
  answerCount: number;
  answers: AnswerItem[];
  createdAt: string;
  updatedAt: string;
}
