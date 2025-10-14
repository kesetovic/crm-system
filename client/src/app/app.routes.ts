import { Routes } from '@angular/router';
import { LoginMainComponent } from './login-main-component/login-main-component';
import { HomeComponent } from './home-component/home-component';

export const routes: Routes = [
    { path: 'login', component: LoginMainComponent },
    { path: '', component: LoginMainComponent },
    {
        path: '', runGuardsAndResolvers: 'always', children: [
            { path: 'home', component: HomeComponent }
        ]
    }
];
