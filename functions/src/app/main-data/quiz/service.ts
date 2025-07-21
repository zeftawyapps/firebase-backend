import { QuizRepo } from "./quiz-repo";

export class QuizService {
  quizRepo: QuizRepo;
  constructor() {
    this.quizRepo = new QuizRepo();
  }
  async getQuestions(depId: any) {
    const quws = await this.quizRepo.getDepsQuistions(depId);
    const length = quws.length;
    if (length >= 30) {
      // get rondom 10 queiz from 30 quies
      const randomQuizes = this.getRandom(quws, 5);
      return randomQuizes;
    } else {
      // get rondom 10 queiz from 20 quies
      const randomQuizes = this.getRandom(quws, 10);
      return randomQuizes;
    }
  }
  getRandom(quws: any[], n: number) {
    const shuffled = Array.from(quws).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
}
