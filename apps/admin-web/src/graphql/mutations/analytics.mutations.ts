
import { gql } from "@apollo/client";

export const UPDATE_ANALYTICS = gql`
  mutation UpdateAnalytics($input: AnalyticsInput!) {
    updateAnalytics(input: $input) { users }
  }
`;
