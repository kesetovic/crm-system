import { Routes } from '@angular/router';
import { LoginMainComponent } from './login-main-component/login-main-component';
import { HomeComponent } from './home-component/home-component';
import { authGuard } from './_guards/auth-guard';
import { NotFoundComponent } from './not-found-component/not-found-component';
import { ServerErrorComponent } from './server-error-component/server-error-component';

export const routes: Routes = [
    { path: 'login', component: LoginMainComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: 'server-error', component: ServerErrorComponent },
    { path: '', component: LoginMainComponent },
    {
        path: '', runGuardsAndResolvers: 'always', canActivate: [authGuard], children: [
            { path: 'home', component: HomeComponent }
        ]
    },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];
