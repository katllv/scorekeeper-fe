export type GameStatus = 'ACTIVE' | 'FINISHED';
export type StarterRule = 'WINNER_STARTS' | 'LOSER_STARTS';

export interface CreateGameRequest {
  targetScore: number;
  roundOffset: number;
  starterRule: StarterRule;
}

export interface AddPlayerRequest {
  username: string;
}

export interface SubmitRoundRequest {
  rawScores: Record<string, number>;
  knockedByGamePlayerId?: string | null;
}

export interface GamePlayerResponse {
  id: string;
  userId: string;
  username: string;
  displayName?: string;
  totalPoints: number;
}

export interface ScoreResponse {
  gamePlayerId: string;
  points: number;
}

export interface RoundResponse {
  id: string;
  roundNumber: number;
  knockedByGamePlayerId?: string | null;
  scores: ScoreResponse[];
  createdAt: string;
}

export interface GameResponse {
  id: string;
  ownerId: string;
  ownerUsername: string;
  status: GameStatus;
  targetScore: number;
  roundOffset: number;
  starterRule: StarterRule;
  winnerId?: string | null;
  winnerUsername?: string | null;
  players: GamePlayerResponse[];
  rounds: RoundResponse[];
  nextStarterGamePlayerId?: string | null;
  createdAt: string;
}

export interface LeaderboardEntryResponse {
  userId: string;
  username: string;
  displayName?: string;
  totalPoints: number;
  gamesWon: number;
  gamesPlayed: number;
  timesKnocked: number;
}
