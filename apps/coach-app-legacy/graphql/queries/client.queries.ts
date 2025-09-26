
import { gql } from "@apollo/client";

export const GET_CLIENTS = gql\`
  query CoachClients {
    coachClients {
      id
      name
      level
      status
    }
  }
\`;

export const GET_CLIENT_DETAIL = gql\`
  query Client($id: Int!) {
    client(id: $id) {
      id
      name
      level
      history
    }
  }
\`;
