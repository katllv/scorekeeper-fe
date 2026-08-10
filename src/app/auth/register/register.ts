import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, submit, required, minLength } from '@angular/forms/signals';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly model = signal({ username: '', password: '', displayName: '' });

  protected readonly registerForm = form(this.model, (s) => {
    required(s.username, { message: 'Brugernavn er påkrævet' });
    minLength(s.username, 2, { message: 'Brugernavn skal være mindst 2 tegn' });
    required(s.password, { message: 'Adgangskode er påkrævet' });
    minLength(s.password, 3, { message: 'Adgangskode skal være mindst 3 tegn' });
  });

  protected onSubmit() {
    submit(this.registerForm, async () => {
      this.auth.register(this.model()).subscribe({
        next: () => this.router.navigateByUrl('/login'),
        error: (err) => console.error('registration failed', err),
      });
    });
  }
}
