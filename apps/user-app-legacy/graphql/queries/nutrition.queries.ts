import { gql } from "@apollo/client";
export const FOOD_SEARCH = gql`query FoodSearch($q:String!){ foodSearch(q:$q){ id title protein carbs fat calories } }`;
export const DAILY_SUMMARY = gql`query DailySummary($userId:Int!, $dateISO:String!){ userDailyNutrition(userId:$userId, dateISO:$dateISO){ calories protein carbs fat } }`;
