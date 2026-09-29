export interface DvaC02Flashcard {
  id: number;
  domainNumber: 1 | 2 | 3 | 4;
  domainName: string;
  category: string;
  topic: string;
  question: string;
  answer: string;
  keyRule: string;
  examTip: string;
  officialDocUrl: string;
  difficulty: 'Foundational' | 'Standard' | 'Advanced';
}
