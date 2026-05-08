import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { ApiService } from '../api/api.service';
import { TokenDetailsDto } from '../../models/token-details.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly platformId = inject(PLATFORM_ID);
    private readonly router = inject(Router);
    private readonly api = inject(ApiService);

    private readonly JWT_KEY = 'idp_jwt';
    private readonly REFRESH_KEY = 'idp_refresh';

    getJwt(): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        return localStorage.getItem(this.JWT_KEY);
    }

    setTokens(tokens: TokenDetailsDto): void {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.setItem(this.JWT_KEY, tokens.jwtToken);
        localStorage.setItem(this.REFRESH_KEY, tokens.refreshToken);
    }

    clearTokens(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.removeItem(this.JWT_KEY);
        localStorage.removeItem(this.REFRESH_KEY);
    }

    isAuthenticated(): boolean {
        const expiry = this.getJwtExpiry();
        return expiry !== null && expiry > Date.now();
    }

    isTokenExpiringSoon(thresholdMs = 5 * 60 * 1000): boolean {
        const expiry = this.getJwtExpiry();
        if (expiry === null) return false;
        return expiry - Date.now() < thresholdMs;
    }

    refresh(): Observable<TokenDetailsDto> {
        return this.api.post<TokenDetailsDto>('/api/token/refresh').pipe(
            tap(tokens => this.setTokens(tokens))
        );
    }

    logout(): Observable<void> {
        return this.api.post<void>('/api/logout').pipe(
            tap({ next: () => this.clearAndRedirect(), error: () => this.clearAndRedirect() })
        );
    }

    clearAndRedirect(): void {
        this.clearTokens();
        this.router.navigateByUrl('/login/sign-in');
    }

    private getJwtExpiry(): number | null {
        const jwt = this.getJwt();
        if (!jwt) return null;
        try {
            const payload = JSON.parse(atob(jwt.split('.')[1]));
            return payload['exp'] ? payload['exp'] * 1000 : null;
        } catch {
            return null;
        }
    }
}
