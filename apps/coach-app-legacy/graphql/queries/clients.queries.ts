
import { gql } from "@apollo/client";

export const CLIENTS_LIST = gql`
  query Clients($search:String, $cursor:String, $limit:Int){
    clients(search:$search, cursor:$cursor, limit:$limit){
      edges{ id name email avatar status lastActiveAt }
      pageInfo{ endCursor hasNextPage }
      total
    }
  }
`;

export const CLIENT_BY_ID = gql`
  query Client($id:ID!){
    client(id:$id){
      id name email avatar phone status height weight birthday
      goals { id title note createdAt }
      notes { id body createdAt author { id name } }
      plans { id title status startDate endDate }
      metrics { date weight bodyFat muscleMass }
      lastActiveAt
    }
  }
`;

export const UPSERT_CLIENT = gql`
  mutation UpsertClient($input:UpsertClientInput!){
    upsertClient(input:$input){ id name email avatar status }
  }
`;

export const ARCHIVE_CLIENT = gql`
  mutation ArchiveClient($id:ID!){
    archiveClient(id:$id)
  }
`;

export const ADD_NOTE = gql`
  mutation AddNote($clientId:ID!, $body:String!){
    addClientNote(clientId:$clientId, body:$body){
      id body createdAt author { id name }
    }
  }
`;

export const CLIENT_NOTES = gql`
  query ClientNotes($clientId:ID!, $cursor:String, $limit:Int){
    clientNotes(clientId:$clientId, cursor:$cursor, limit:$limit){
      edges{ id body createdAt author { id name } }
      pageInfo{ endCursor hasNextPage }
    }
  }
`;
