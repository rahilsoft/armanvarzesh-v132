
import { gql } from "@apollo/client";

export const PLANS_LIST = gql`
  query Plans($cursor:String, $limit:Int, $search:String){
    plans(cursor:$cursor, limit:$limit, search:$search){
      edges{ id title description status version updatedAt assignedCount }
      pageInfo{ endCursor hasNextPage }
      total
    }
  }
`;

export const PLAN_BY_ID = gql`
  query Plan($id:ID!){
    plan(id:$id){
      id title description status version updatedAt
      days{
        id order title
        blocks{ id order type protocol protocolParams restBetweenItems items{ id order note exercise { id name muscleGroup equipment } sets{ reps weight rest tempo } } }
          id order note
          exercise { id name muscleGroup equipment }
          sets{ reps weight rest tempo }
        }
      }
    }
  }
`;

export const UPSERT_PLAN = gql`
  mutation UpsertPlan($input:UpsertPlanInput!){
    upsertPlan(input:$input){
      id title description status version updatedAt
    }
  }
`;

export const DUPLICATE_PLAN = gql`
  mutation DuplicatePlan($id:ID!){
    duplicatePlan(id:$id){ id title description status version }
  }
`;

export const PUBLISH_PLAN = gql`
  mutation PublishPlan($id:ID!){
    publishPlan(id:$id){ id status version updatedAt }
  }
`;

export const ASSIGN_PLAN = gql`
  mutation AssignPlan($planId:ID!, $clientId:ID!, $startDate:String!, $sessionsPerWeek:Int!, $restDays:[String!]!, $durationDays:Int!){
    assignPlan(planId:$planId, clientId:$clientId, startDate:$startDate, sessionsPerWeek:$sessionsPerWeek, restDays:$restDays, durationDays:$durationDays){ id planId clientId startDate sessionsPerWeek restDays durationDays }
  }
`;

export const EXERCISE_LIBRARY = gql`
  query Exercises($search:String, $muscle:String, $equipment:String, $cursor:String, $limit:Int){
    exercises(search:$search, muscle:$muscle, equipment:$equipment, cursor:$cursor, limit:$limit){
      edges{ id name muscleGroup equipment media }
      pageInfo{ endCursor hasNextPage }
      total
    }
  }
`;
