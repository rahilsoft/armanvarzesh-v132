
import { gql } from "@apollo/client";

export const GET_SURVEYS = gql`
  query GetSurveys {
    surveys {
      id
      question
    }
  }
`;
