export class Review {
  /** Unique identifier for the review */
  id!: number;

  /** Identifier of the expert (coach, nutritionist or physiotherapist) being reviewed */
  expertId!: number;

  /** Rating given by the reviewer (1–5) */
  rating!: number;

  /** Optional textual comment accompanying the rating */
  comment?: string;
}