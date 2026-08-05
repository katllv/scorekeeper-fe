import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserResponse } from '../auth/auth.model';

@Service()
export class UserSearch {
  private readonly http = inject(HttpClient);

  search(query: string) {
    return this.http.get<UserResponse[]>('/api/users', { params: { query } });
  }
}
