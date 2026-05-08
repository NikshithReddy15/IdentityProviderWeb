import { Routes } from '@angular/router';

import { authGuard } from './shared/guards/auth.guard';
import { guestGuard } from './shared/guards/guest.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [authGuard],
    },
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () =>
            import('./login/login.component').then((m) => m.LoginComponent),
        children: [
            {
                path: 'sign-in',
                loadComponent: () =>
                    import('./login/sign-in/sign-in.component').then(
                        (m) => m.SignInComponent
                    ),
            },
            {
                path: 'sign-up',
                loadComponent: () =>
                    import('./login/sign-up/sign-up.component').then(
                        (m) => m.SignUpComponent
                    ),
            },
            {
                path: 'verify-otp',
                loadComponent: () =>
                    import('./login/verify-otp/verify-otp.component').then(
                        (m) => m.VerifyOtpComponent
                    ),
            },
            { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
        ],
    },
    { path: '**', redirectTo: 'login/sign-in' },
];
