import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../_services/auth';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  if (authService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.currentUser()?.token}`
      }
    })
  }
  return next(req);
};