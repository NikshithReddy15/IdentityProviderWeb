import { Injectable, InjectionToken, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IApiService } from './api.service.interface';

export const API_SERVICE = new InjectionToken<IApiService>('API_SERVICE');

export function API_SERVICE_PROVIDER_FACTORY(injector: Injector) {
    return () => injector.get(ApiService) as IApiService;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService implements IApiService {
    private readonly baseUrl: string;

    constructor(private readonly http: HttpClient) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        this.baseUrl = `${origin.replace(/\/$/, '')}/api`;
    }

    private buildUrl(path: string) {
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${this.baseUrl}${cleanPath}`;
    }

    private buildHttpParams(params?: Record<string, string | number | boolean>) {
        let httpParams = new HttpParams();
        if (!params) return httpParams;
        for (const [k, v] of Object.entries(params)) {
            if (v === undefined || v === null) continue;
            httpParams = httpParams.append(k, String(v));
        }
        return httpParams;
    }

    private request<T>(method: string, path: string, body?: any, params?: Record<string, string | number | boolean>, extraHeaders?: Record<string, string>): Observable<T> {
        const url = this.buildUrl(path);
        let headers = new HttpHeaders({
            Accept: 'application/json',
            ...extraHeaders,
        });

        const httpParams = this.buildHttpParams(params);

        const options: any = {
            headers,
            params: httpParams,
            withCredentials: true,
            observe: 'response' as const,
        };

        if (body !== undefined && body !== null && body instanceof FormData) {
            headers = headers.delete('Content-Type');
            options.headers = headers;
            options.body = body;
        } else if (body !== undefined && body !== null) {
            options.body = body;
        }

        return this.http.request<T>(method, url, options).pipe(
            map((res: any) => {
                if (res.status === 204) return undefined as unknown as T;
                return res.body as T;
            }),
            catchError((e: any) => {
                if (e instanceof HttpErrorResponse) {
                    const err = new Error(e.statusText || 'Request failed');
                    (err as any).status = e.status;
                    (err as any).body = e.error;
                    return throwError(() => err);
                }
                return throwError(() => e);
            })
        );
    }

    get<T>(path: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>) {
        return this.request<T>('GET', path, undefined, params, headers);
    }

    post<T>(path: string, body?: any, params?: Record<string, string | number | boolean>, headers?: Record<string, string>) {
        return this.request<T>('POST', path, body, params, headers);
    }

    put<T>(path: string, body?: any, params?: Record<string, string | number | boolean>, headers?: Record<string, string>) {
        return this.request<T>('PUT', path, body, params, headers);
    }

    delete<T>(path: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>) {
        return this.request<T>('DELETE', path, undefined, params, headers);
    }
}

