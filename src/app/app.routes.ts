import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { GameList } from './games/game-list/game-list';
import { GameCreate } from './games/game-create/game-create';
import { GameDetail } from './games/game-detail/game-detail';
import { Leaderboard } from './leaderboard/leaderboard';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  { path: '', component: GameList, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'games/new', component: GameCreate, canActivate: [authGuard] },
  { path: 'games/:id', component: GameDetail, canActivate: [authGuard] },
  { path: 'leaderboard', component: Leaderboard, canActivate: [authGuard] },
];
