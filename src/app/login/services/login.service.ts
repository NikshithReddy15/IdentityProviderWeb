import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api';
import { EmailLoginDto } from '../models/email-login-dto.model';
import { TokenDetailsDto } from '../../shared/models/token-details.model';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    constructor(private readonly api: ApiService) {}

    login(dto: EmailLoginDto): Observable<TokenDetailsDto> {
        return this.api.post<TokenDetailsDto>('login', dto);
    }
}

