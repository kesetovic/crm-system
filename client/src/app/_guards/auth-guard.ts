import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../_services/auth';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(Auth);
  const toastr = inject(ToastrService);
  if (accountService.currentUser()) {
    return true;
  } else {
    toastr.error('You are not logged in!');
    const router = inject(Router);
    router.navigateByUrl('/login');
    return false;
  }
};