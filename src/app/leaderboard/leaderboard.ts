import { Component, inject, signal } from '@angular/core';
import { GameService } from '../core/game/game';
import { LeaderboardEntryResponse } from '../core/game/game.model';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
  private readonly gameService = inject(GameService);

  protected readonly entries = signal<LeaderboardEntryResponse[]>([]);

  constructor() {
    this.gameService.getLeaderboard().subscribe((entries) => this.entries.set(entries));
  }
}
