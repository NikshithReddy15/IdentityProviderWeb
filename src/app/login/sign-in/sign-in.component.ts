import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { EmailLoginDto } from '../models';
import { LoginService } from '../services/login.service';
import { UtilsService } from '../../shared/services/util/util.service';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './sign-in.component.html'
})
export class SignInComponent {
    signInForm: FormGroup;
    protected submitted = false;
    protected signInError: string | null = null;
    protected loading = false;
    protected method: 'email' | 'phone' = 'email';

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly loginService: LoginService
    ) {
        this.signInForm = this.fb.nonNullable.group({
            email: [''],
            password: [''],
            phone: [''],
            code: [''],
        });
        this.useEmail();
    }

    get email() {
        return this.signInForm.get('email');
    }

    get password() {
        return this.signInForm.get('password');
    }
    get phone() {
        return this.signInForm.get('phone');
    }
    get code() {
        return this.signInForm.get('code');
    }

    onSubmit(): void {
        this.submitted = true;
        this.signInError = null;
        if (this.signInForm.invalid) {
            return;
        }
        this.loading = true;
        const vals = this.signInForm.getRawValue();
        if (this.method === 'email') {
            if (!vals.email || !vals.password) {
                this.signInError = 'Email and password are required';
                this.loading = false;
                return;
            }

            const dto = new EmailLoginDto();
            dto.email = vals.email;
            dto.password = vals.password;
            dto.deviceName = typeof navigator !== 'undefined' ? (navigator.userAgent || 'web') : 'web';
            dto.deviceId = UtilsService.generateGUID();
            this.loginService.login(dto)
                .subscribe({
                    next: (tokens) => {
                        localStorage.setItem('idp_jwt', tokens.jwtToken);
                        localStorage.setItem('idp_refresh', tokens.refreshToken);
                        this.router.navigateByUrl('/');
                    },
                    error: (err: any) => {
                        this.signInError = err?.body?.message || err?.message || 'Sign in failed';
                    },
                }).add(() => (this.loading = false));
        } else if (this.method === 'phone') {
            this.loading = false;
        }
    }

    switchMethod(signInMethod: 'email' | 'phone') {
        if (signInMethod === this.method) return;
        this.method = signInMethod;
        this.signInForm.reset();
        if (signInMethod === 'email') {
            this.useEmail();
        } else {
            this.usePhone();
        }
    }

    private useEmail() {
        this.email?.setValidators([Validators.required, Validators.email]);
        this.password?.setValidators([Validators.required, Validators.minLength(8)]);
        this.phone?.clearValidators();
        this.code?.clearValidators();
        this.email?.updateValueAndValidity();
        this.password?.updateValueAndValidity();
        this.phone?.updateValueAndValidity();
        this.code?.updateValueAndValidity();
    }

    private usePhone() {
        this.phone?.setValidators([Validators.required]);
        this.code?.setValidators([Validators.required, Validators.minLength(6)]);
        this.email?.clearValidators();
        this.password?.clearValidators();
        this.email?.updateValueAndValidity();
        this.password?.updateValueAndValidity();
        this.phone?.updateValueAndValidity();
        this.code?.updateValueAndValidity();
    }
}
