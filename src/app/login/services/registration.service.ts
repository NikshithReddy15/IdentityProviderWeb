import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api';
import { RegisterUserDto } from '../models/register-user.model';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    constructor(private readonly api: ApiService) {}

    register(dto: RegisterUserDto): Observable<void> {
        return this.api.post<void>('user/registration', dto);
    }
}

