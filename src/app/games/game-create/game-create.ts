import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { GameService } from '../../core/game/game';
import { ScoringMode, StarterRule } from '../../core/game/game.model';
import { UserSearch } from '../../core/user/user';
import { UserResponse } from '../../core/auth/auth.model';

@Component({
  selector: 'app-game-create',
  imports: [FormField, RouterLink],
  templateUrl: './game-create.html',
  styleUrl: './game-create.css',
  host: {
    '(document:click)': 'closeDropdown()',
  },
})
export class GameCreate {
  private readonly gameService = inject(GameService);
  private readonly userSearch = inject(UserSearch);
  private readonly router = inject(Router);

  protected readonly players = signal<string[]>([]);
  protected readonly newPlayerUsername = signal('');
  protected readonly searchResults = signal<UserResponse[]>([]);

  protected readonly preset = signal<'LOSER' | 'WINNER' | 'POINTS' | 'CUSTOM'>('LOSER');

  protected readonly model = signal({
    targetScore: 100,
    roundOffset: 0,
    starterRule: 'WINNER_STARTS' as StarterRule,
    scoringMode: 'CARD_TOTAL' as ScoringMode,
  });

  protected readonly createForm = form(this.model, (s) => {
    required(s.targetScore, { message: 'Målscore er påkrævet' });
  });

  protected selectPreset(preset: 'LOSER' | 'WINNER' | 'POINTS' | 'CUSTOM') {
    this.preset.set(preset);
    if (preset === 'LOSER') {
      this.model.update((m) => ({
        ...m,
        targetScore: 100,
        roundOffset: 0,
        scoringMode: 'CARD_TOTAL',
      }));
    } else if (preset === 'WINNER') {
      this.model.update((m) => ({
        ...m,
        targetScore: -100,
        roundOffset: -10,
        scoringMode: 'CARD_TOTAL',
      }));
    } else if (preset === 'POINTS') {
      this.model.update((m) => ({
        ...m,
        targetScore: 20,
        roundOffset: 0,
        scoringMode: 'PLACEMENT',
      }));
    } else {
      this.model.update((m) => ({ ...m, scoringMode: 'CARD_TOTAL' }));
    }
  }

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

  protected closeDropdown() {
    this.searchResults.set([]);
  }

  protected onSearchFocus() {
    const trimmed = this.newPlayerUsername().trim();
    if (trimmed.length >= 2) {
      this.userSearch.search(trimmed).subscribe((results) => this.searchResults.set(results));
    }
  }

  protected onStartGame() {
    submit(this.createForm, async () => {
      const request = { ...this.model(), playerUsernames: this.players() };
      this.gameService.createGame(request).subscribe({
        next: (game) => this.router.navigate(['/games', game.id]),
        error: (err) => console.error('kunne ikke oprette spil', err),
      });
    });
  }
}
