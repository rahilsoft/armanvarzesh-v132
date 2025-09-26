import { gql } from "@apollo/client";
export const LOG_MEAL = gql`mutation LogMeal($input:LogMealInput!){ logMeal(input:$input){ id userId foodId grams createdAt } }`;
