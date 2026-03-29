import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegistrationService } from '../services';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { NotificationType } from '../../shared/models/notification-type.enum';

const RESEND_COOLDOWN_SECONDS = 60;

@Component({
    selector: 'app-verify-otp',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
    protected email = signal<string>('');
    protected otpForm;
    protected readonly submitted = signal(false);
    protected readonly loading = signal(false);
    protected readonly resending = signal(false);
    protected readonly error = signal<string | null>(null);
    protected readonly resendCooldown = signal(0);

    private cooldownInterval: ReturnType<typeof setInterval> | null = null;

    constructor(
        private readonly fb: FormBuilder,
        private readonly registrationService: RegistrationService,
        private readonly router: Router,
        private readonly notificationService: NotificationService
    ) {
        this.otpForm = this.fb.nonNullable.group({
            otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d{6}$/)]]
        });
    }

    ngOnInit(): void {
        const state = this.router.lastSuccessfulNavigation()?.extras?.state;
        const emailFromState = state?.['email'] as string | undefined;
        if (emailFromState) {
            this.email.set(emailFromState);
        } else {
            this.router.navigateByUrl('/login/sign-up');
        }
    }

    ngOnDestroy(): void {
        if (this.cooldownInterval) clearInterval(this.cooldownInterval);
    }

    onSubmit(): void {
        this.submitted.set(true);
        this.error.set(null);
        if (this.otpForm.invalid) return;

        this.loading.set(true);
        this.registrationService.verifyOtp({ email: this.email(), otpCode: this.otpForm.getRawValue().otpCode })
            .subscribe({
                next: () => {
                    this.notificationService.show('Account verified successfully. You can now sign in.', NotificationType.SUCCESS);
                    this.router.navigateByUrl('/login/sign-in');
                },
                error: (err: any) => {
                    const msg = err?.body?.message || err?.message || 'OTP verification failed';
                    this.error.set(msg);
                    this.notificationService.show(msg, NotificationType.ERROR);
                }
            }).add(() => this.loading.set(false));
    }

    onResend(): void {
        this.error.set(null);
        this.resending.set(true);
        this.registrationService.resendOtp(this.email())
            .subscribe({
                next: () => {
                    this.notificationService.show('A new verification code has been sent to your email.', NotificationType.SUCCESS);
                    this.otpForm.reset();
                    this.submitted.set(false);
                    this.startCooldown();
                },
                error: (err: any) => {
                    const msg = err?.body?.message || err?.message || 'Failed to resend OTP';
                    this.error.set(msg);
                    this.notificationService.show(msg, NotificationType.ERROR);
                }
            }).add(() => this.resending.set(false));
    }

    private startCooldown(): void {
        this.resendCooldown.set(RESEND_COOLDOWN_SECONDS);
        this.cooldownInterval = setInterval(() => {
            const remaining = this.resendCooldown() - 1;
            if (remaining <= 0) {
                this.resendCooldown.set(0);
                clearInterval(this.cooldownInterval!);
                this.cooldownInterval = null;
            } else {
                this.resendCooldown.set(remaining);
            }
        }, 1000);
    }
}
