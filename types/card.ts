export type Card = {
  id: number;
  question: string;
    answer: string;
    category: string;
    status: "new" | "mastered";
};
