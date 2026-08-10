import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameService } from '../../core/game/game';
import { GameResponse, gameStatusLabel } from '../../core/game/game.model';

@Component({
  selector: 'app-game-list',
  imports: [RouterLink, DatePipe],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css',
})
export class GameList {
  private readonly gameService = inject(GameService);

  protected readonly games = signal<GameResponse[]>([]);
  protected readonly loading = signal(true);

  constructor() {
    this.gameService.listGames().subscribe((games) => {
      this.games.set(games);
      this.loading.set(false);
    });
  }

  protected statusLabel = gameStatusLabel;
}
