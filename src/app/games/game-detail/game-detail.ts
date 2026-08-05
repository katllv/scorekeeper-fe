import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { GameService } from '../../core/game/game';
import { GameResponse } from '../../core/game/game.model';

@Component({
  selector: 'app-game-detail',
  imports: [FormField],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.css',
})
export class GameDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly gameService = inject(GameService);

  private readonly gameId = this.route.snapshot.params['id'];

  protected readonly game = signal<GameResponse | null>(null);
  protected readonly roundScores = signal<Record<string, number>>({});
  protected readonly knockedBy = signal<string>('');

  protected readonly addPlayerModel = signal({ username: '' });
  protected readonly addPlayerForm = form(this.addPlayerModel, (s) => {
    required(s.username, { message: 'Username is required' });
  });

  constructor() {
    this.loadGame();
  }

  protected onAddPlayer() {
    submit(this.addPlayerForm, async () => {
      this.gameService.addPlayer(this.gameId, this.addPlayerModel()).subscribe({
        next: (game) => {
          this.game.set(game);
          this.addPlayerModel.set({ username: '' });
        },
        error: (err) => console.error('failed to add player', err),
      });
    });
  }

  protected updateScore(gamePlayerId: string, value: string) {
    this.roundScores.update((scores) => ({ ...scores, [gamePlayerId]: Number(value) }));
  }

  protected onSubmitRound() {
    this.gameService
      .submitRound(this.gameId, {
        rawScores: this.roundScores(),
        knockedByGamePlayerId: this.knockedBy() || null,
      })
      .subscribe({
        next: (game) => {
          this.game.set(game);
          this.roundScores.set({});
          this.knockedBy.set('');
        },
        error: (err) => console.error('failed to submit round', err),
      });
  }

  private loadGame() {
    this.gameService.getGame(this.gameId).subscribe((game) => this.game.set(game));
  }
}
