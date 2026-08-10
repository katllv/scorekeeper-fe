import { Component, inject, signal } from '@angular/core';
import { GameService } from '../core/game/game';
import { LeaderboardEntryResponse } from '../core/game/game.model';
import { avatarColor, avatarInitial } from '../core/util/avatar';

@Component({
  selector: 'app-leaderboard',
  imports: [],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css',
})
export class Leaderboard {
  private readonly gameService = inject(GameService);

  protected readonly entries = signal<LeaderboardEntryResponse[]>([]);
  protected readonly loading = signal(true);
  protected avatarColor = avatarColor;
  protected avatarInitial = avatarInitial;

  constructor() {
    this.gameService.getLeaderboard().subscribe((entries) => {
      this.entries.set(entries);
      this.loading.set(false);
    });
  }
}
