import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../core/auth/auth';

@Component({
  selector: 'app-nav',
  imports: [RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected onLogout() {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/login'));
  }
}
