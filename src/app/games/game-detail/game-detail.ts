import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../core/game/game';
import { GameResponse, gameStatusLabel } from '../../core/game/game.model';
import { avatarColor, avatarInitial } from '../../core/util/avatar';

@Component({
  selector: 'app-game-detail',
  imports: [RouterLink],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css',
})
export class GameDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly gameService = inject(GameService);

  private readonly gameId = this.route.snapshot.params['id'];

  protected readonly game = signal<GameResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly roundScores = signal<Record<string, number>>({});
  protected readonly knockedBy = signal<string>('');

  constructor() {
    this.loadGame();
  }

  protected statusLabel = gameStatusLabel;
  protected avatarColor = avatarColor;
  protected avatarInitial = avatarInitial;

  protected playerName(gamePlayerId: string): string {
    const player = this.game()?.players.find((p) => p.id === gamePlayerId);
    return player ? player.displayName || player.username : 'Ukendt spiller';
  }

  protected reversedRounds() {
    return [...(this.game()?.rounds ?? [])].reverse();
  }

  protected updateScore(gamePlayerId: string, value: string) {
    this.roundScores.update((scores) => ({ ...scores, [gamePlayerId]: Number(value) }));
  }

  protected selectKnockedBy(gamePlayerId: string) {
    this.knockedBy.set(gamePlayerId);
  }

  protected onSubmitRound() {
    this.gameService
      .submitRound(this.gameId, {
        rawScores: this.roundScores(),
        knockedByGamePlayerId: this.knockedBy(),
      })
      .subscribe({
        next: (game) => {
          this.game.set(game);
          this.roundScores.set({});
          this.knockedBy.set('');
        },
        error: (err) => console.error('kunne ikke gemme runde', err),
      });
  }

  private loadGame() {
    this.gameService.getGame(this.gameId).subscribe((game) => {
      this.game.set(game);
      this.loading.set(false);
    });
  }
}
