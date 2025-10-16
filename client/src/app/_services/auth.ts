import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { environment } from '../../env/environment.development';
import { AuthResponse } from '../_models/authReponse';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private http = inject(HttpClient);
  router = inject(Router);
  toastr = inject(ToastrService);

  baseUrl = environment.apiUrl;
  currentUser = signal<AuthResponse | null>(null);
  roles = computed(() => this.currentUser()?.roles || []);

  constructor() {
    const user = localStorage.getItem('auth');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
  }

  login(model: any) {
    return this.http.post<AuthResponse>(this.baseUrl + 'auth/login', model).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      }));
  }


  logout() {
    localStorage.removeItem('auth');
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
    this.toastr.info('Sucessfully logged out!');

  }

  setCurrentUser(user: AuthResponse): void {
    localStorage.setItem('auth', JSON.stringify(user));
    this.currentUser.set(user);
  }
}
