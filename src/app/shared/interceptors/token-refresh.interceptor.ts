import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { EMPTY, catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth/auth.service';

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    return next(req).pipe(
        catchError(err => {
            if (err?.status === HttpStatusCode.Unauthorized) {
                authService.clearAndRedirect();
                return EMPTY;
            }
            return throwError(() => err);
        })
    );
};
