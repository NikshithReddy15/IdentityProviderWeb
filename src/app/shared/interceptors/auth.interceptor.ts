import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError, switchMap } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';

const PUBLIC_PATHS = ['/api/login', '/api/user/registration'];
const API_PATH = '/k/identity';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    if (!req.url.includes(API_PATH)) return next(req);

    const isPublic = PUBLIC_PATHS.some(path => req.url.includes(path));
    if (isPublic) return next(req);

    const jwt = authService.getJwt();

    // Refresh endpoint: just attach the current token, no recursive proactive refresh
    if (req.url.includes('/api/token/refresh')) {
        if (!jwt) { authService.clearAndRedirect(); return EMPTY; }
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } }));
    }

    if (!jwt || !authService.isAuthenticated()) {
        authService.clearAndRedirect();
        return EMPTY;
    }

    if (authService.isTokenExpiringSoon()) {
        return authService.refresh().pipe(
            switchMap(tokens => next(req.clone({ setHeaders: { Authorization: `Bearer ${tokens.jwtToken}` } }))),
            catchError(() => { authService.clearAndRedirect(); return EMPTY; })
        );
    }

    return next(req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } }));
};
