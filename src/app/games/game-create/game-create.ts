import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { GameService } from '../../core/game/game';
import { StarterRule } from '../../core/game/game.model';
import { UserSearch } from '../../core/user/user';
import { UserResponse } from '../../core/auth/auth.model';

@Component({
  selector: 'app-game-create',
  imports: [FormField],
  templateUrl: './game-create.html',
  styleUrl: './game-create.css',
})
export class GameCreate {
  private readonly gameService = inject(GameService);
  private readonly userSearch = inject(UserSearch);
  private readonly router = inject(Router);

  protected readonly players = signal<string[]>([]);
  protected readonly newPlayerUsername = signal('');
  protected readonly searchResults = signal<UserResponse[]>([]);

  protected readonly model = signal({
    targetScore: 100,
    roundOffset: 0,
    starterRule: 'WINNER_STARTS' as StarterRule,
  });

  protected readonly createForm = form(this.model, (s) => {
    required(s.targetScore, { message: 'Target score is required' });
  });

  constructor() {
    toObservable(this.newPlayerUsername)
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((query) => {
          const trimmed = query.trim();
          return trimmed.length >= 2 ? this.userSearch.search(trimmed) : of([]);
        }),
      )
      .subscribe((results) => this.searchResults.set(results));
  }

  protected addPlayer(username: string) {
    if (!username || this.players().includes(username)) {
      return;
    }
    this.players.update((players) => [...players, username]);
    this.newPlayerUsername.set('');
    this.searchResults.set([]);
  }

  protected removePlayer(username: string) {
    this.players.update((players) => players.filter((p) => p !== username));
  }

  protected onStartGame() {
    submit(this.createForm, async () => {
      this.gameService.createGame(this.model()).subscribe({
        next: (game) => {
          const additions = this.players().map((username) =>
            this.gameService.addPlayer(game.id, { username }),
          );

          forkJoin(additions.length ? additions : [of(game)]).subscribe({
            next: () => this.router.navigate(['/games', game.id]),
            error: (err) => console.error('failed to add players', err),
          });
        },
        error: (err) => console.error('failed to create game', err),
      });
    });
  }
}
