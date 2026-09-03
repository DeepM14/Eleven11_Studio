import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from './firebase.service';

export const authGuard: CanActivateFn = async () => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  const user = await firebaseService.waitForAuthReady();

  if (user) {
    return true;
  }

  router.navigate(['/admin-login']);
  return false;
};