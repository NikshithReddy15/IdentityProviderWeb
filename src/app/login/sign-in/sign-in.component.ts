import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { EmailLoginDto } from '../models';
import { LoginType } from './models/login-type.enum';
import { LoginService } from '../services/login.service';
import { UtilsService } from '../../shared/services/util/util.service';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { TokenDetailsDto } from '../../shared/models';
import { NotificationType } from '../../shared/models/notification-type.enum';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {
    emailForm!: FormGroup;
    phoneForm!: FormGroup;

    protected readonly submitted = signal(false);
    protected readonly loading = signal(false);
    protected readonly method = signal<LoginType>(LoginType.EMAIL);
    // expose enum to template
    protected readonly LoginType = LoginType;

    get email() { return this.emailForm.get('email'); }
    get password() { return this.emailForm.get('password'); }
    get phone() { return this.phoneForm.get('phone'); }
    get code() { return this.phoneForm.get('code'); }

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly loginService: LoginService,
        private readonly notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.emailForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });

        this.phoneForm = this.fb.group({
            countryCode: ['+91', [Validators.maxLength(4)]],
            phone: ['', [Validators.required, Validators.maxLength(17)]],
            code: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    signIn(): void {
        this.submitted.set(true);
        if (this.method() === LoginType.EMAIL) {
            if (this.emailForm.invalid) return;
            const vals = this.emailForm.getRawValue();
            if (!vals.email || !vals.password) {
                this.notificationService.show('Email and password are required', NotificationType.ERROR);
                return;
            }
            this.loading.set(true);
            const dto: EmailLoginDto = {
                email: vals.email,
                password: vals.password,
                deviceName: typeof navigator !== 'undefined' ? (navigator.userAgent || 'web') : 'web',
                deviceId: UtilsService.generateGUID(),
            };

            this.loginService.login(dto)
                .pipe(finalize(() => this.loading.set(false)))
                .subscribe({
                    next: (tokens: TokenDetailsDto) => {
                        localStorage.setItem('idp_jwt', tokens.jwtToken);
                        localStorage.setItem('idp_refresh', tokens.refreshToken);
                        this.notificationService.show('Signed in successfully', NotificationType.SUCCESS);
                        this.router.navigateByUrl('/');
                    },
                    error: (err: any) => {
                        this.notificationService.show(err?.body?.message || err?.message || 'Sign in failed', NotificationType.ERROR);
                    }
                });
        } else {
            if (this.phoneForm.invalid) return;
            const vals = this.phoneForm.getRawValue();
            // phone sign-in flow (stubbed): show notification for now
            this.notificationService.show('Phone sign-in not implemented', NotificationType.INFO);
        }
    }

    switchMethod(signInMethod: LoginType) {
        if (signInMethod === this.method()) return;
        this.method.set(signInMethod);
        this.submitted.set(false);
        this.emailForm.reset();
        this.phoneForm.reset();
        this.phoneForm.get('countryCode')?.setValue('+91');
        this.emailForm.updateValueAndValidity();
        this.phoneForm.updateValueAndValidity();
    }
}
