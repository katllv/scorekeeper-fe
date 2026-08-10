import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateGameRequest, GameResponse, LeaderboardEntryResponse, SubmitRoundRequest } from './game.model';

@Service()
export class GameService {
  private readonly http = inject(HttpClient);

  createGame(request: CreateGameRequest) {
    return this.http.post<GameResponse>('/api/games', request);
  }

  listGames() {
    return this.http.get<GameResponse[]>('/api/games');
  }

  getGame(gameId: string) {
    return this.http.get<GameResponse>(`/api/games/${gameId}`);
  }

  submitRound(gameId: string, request: SubmitRoundRequest) {
    return this.http.post<GameResponse>(`/api/games/${gameId}/rounds`, request);
  }

  getLeaderboard() {
    return this.http.get<LeaderboardEntryResponse[]>('/api/leaderboard');
  }
}
