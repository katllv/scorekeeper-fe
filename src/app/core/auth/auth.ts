import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginRequest, RegisterRequest, UserResponse } from './auth.model';

@Service()
export class Auth {
    private readonly http = inject(HttpClient);

    readonly currentUser = signal<UserResponse | null>(null);

    login(credentials: LoginRequest) {
        return this.http.post<void>('/api/auth/login', credentials);
    }

    register(details: RegisterRequest) {
        return this.http.post<UserResponse>('/api/auth/register', details);
    }

    me() {
        return this.http
            .get<UserResponse>('/api/auth/me')
            .pipe(tap((user) => this.currentUser.set(user)));
    }

    logout() {
        return this.http
            .post<void>('/api/auth/logout', {})
            .pipe(tap(() => this.currentUser.set(null)));
    }
}
