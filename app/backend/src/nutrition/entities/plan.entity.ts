/**
 * A simple representation of a nutrition plan assigned to a user.
 * Plans consist of a collection of items where each item
 * references a food identifier and the amount in grams.  The plan
 * does not currently distinguish between meals or days; those
 * features can be added in future iterations.
 */
export class NutritionPlan {
  id!: number;
  /** Identifier of the user the plan belongs to */
  userId!: number;
  /** List of items (foodId and grams) contained in the plan */
  items!: { foodId: number; grams: number }[];
  createdAt!: Date;
}