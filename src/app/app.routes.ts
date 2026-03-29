import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'login/sign-in', pathMatch: 'full' },
    {
        path: 'login',
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
