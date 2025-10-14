import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { jwtInterceptor } from './_interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      progressBar: true,
      progressAnimation: 'increasing',
    }),
    importProvidersFrom(NgxSpinnerModule)
  ]
};
