
import { gql } from "@apollo/client";

export const GET_LEADERBOARD = gql\`
  query Leaderboard {
    leaderboard {
      id
      userId
      xp
      calories
      sessions
      timeframe
    }
  }
\`;
