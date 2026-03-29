import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api';
import { RegisterUserDto } from '../models/register-user.model';
import { VerifyOtpDto } from '../models/verify-otp.model';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    private readonly baseUrl: string = '/api/user/registration';
    constructor(private readonly api: ApiService) {}

    register(dto: RegisterUserDto): Observable<void> {
        return this.api.post<void>(this.baseUrl, dto);
    }

    verifyOtp(dto: VerifyOtpDto): Observable<void> {
        return this.api.post<void>(`${this.baseUrl}/verify-otp`, dto);
    }

    resendOtp(email: string): Observable<void> {
        return this.api.post<void>(`${this.baseUrl}/resend-otp`, { email });
    }
}

