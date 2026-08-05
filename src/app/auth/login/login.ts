import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, submit, required } from '@angular/forms/signals';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly model = signal({ username: '', password: '' });

  protected readonly loginForm = form(this.model, (s) => {
    required(s.username, { message: 'Username is required' });
    required(s.password, { message: 'Password is required' });
  });

  protected onSubmit() {
    submit(this.loginForm, async () => {
      this.auth.login(this.model()).subscribe({
        next: () => {
          this.auth.me().subscribe(() => this.router.navigateByUrl('/'));
        },
        error: (err) => console.error('login failed', err),
      });
    });
  }
}
