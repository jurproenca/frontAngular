import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private authToken = '';

  // Método de login existente
  login(username: string, password: string): Observable<boolean> {
    if (username === 'admin' && password === 'admin') {
      return of(true).pipe(
        delay(500),
        tap(() => {
          this.isLoggedIn = true;
          this.authToken = 'fake-jwt-token';
          localStorage.setItem('token', this.authToken);
        })
      );
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  // Novo método de signup
  signup(userData: any): Observable<boolean> {
    // Simulação de cadastro bem-sucedido
    return of(true).pipe(
      delay(500),
      tap(() => {
        this.isLoggedIn = true;
        this.authToken = 'fake-jwt-token-new-user';
        localStorage.setItem('token', this.authToken);
        localStorage.setItem('user', JSON.stringify(userData));
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.authToken = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('token');
  }

  getToken(): string {
    return this.authToken || localStorage.getItem('token') || '';
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}