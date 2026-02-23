import { Observable } from 'rxjs';

export interface IApiService {
    get<T>(path: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T>;
    post<T>(path: string, body?: any, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T>;
    put<T>(path: string, body?: any, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T>;
    delete<T>(path: string, params?: Record<string, string | number | boolean>, headers?: Record<string, string>): Observable<T>;
}

