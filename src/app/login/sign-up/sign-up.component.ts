import { Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegistrationService } from '../services';
import { RegisterUserDto } from '../models';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { NotificationType } from '../../shared/models/notification-type.enum';
import { CountryCodePickerComponent } from '../../shared/components/country-code-picker/country-code-picker.component';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, CountryCodePickerComponent],
    templateUrl: './sign-up.component.html'
})
export class SignUpComponent {
    protected signUpForm;
    protected readonly submitted = signal(false);
    protected readonly loading = signal(false);
    protected readonly error = signal<string | null>(null);

    constructor(
        private readonly fb: FormBuilder,
        private readonly registrationService: RegistrationService,
        private readonly router: Router,
        private readonly notificationService: NotificationService
    ) {
        this.signUpForm = this.fb.nonNullable.group({
            firstName: ['', [Validators.required, Validators.maxLength(64), Validators.pattern(/^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*$/)]],
            middleName: ['', [Validators.maxLength(64), Validators.pattern(/^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*$/)]],
            lastName: ['', [Validators.required, Validators.maxLength(64), Validators.pattern(/^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*$/)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(64)]],
            countryCode: ['+91', Validators.maxLength(4)],
            mobileNumber: ['', Validators.maxLength(17)],
            password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
            confirmPassword: ['', [Validators.required, this.passwordValidator.bind(this)]],
        });
    }

    passwordValidator(control: AbstractControl): ValidationErrors | null {
        const password = this.signUpForm?.get('password')?.value;
        return password && control.value !== password ? { passwordMismatch: true } : null;
    }

    onSubmit(): void {
        this.submitted.set(true);
        this.error.set(null);
        if (this.signUpForm.invalid) return;
        const vals = this.signUpForm.getRawValue();
        if (vals.password !== vals.confirmPassword) {
            this.error.set('Passwords do not match');
            return;
        }
        const mobileNumber = vals.mobileNumber || null;
        const dto: RegisterUserDto = {
            firstName: vals.firstName,
            middleName: vals.middleName || null,
            lastName: vals.lastName,
            email: vals.email,
            countryCode: mobileNumber ? (vals.countryCode || null) : null,
            mobileNumber,
            password: vals.password
        };

        this.loading.set(true);
        this.registrationService.register(dto)
            .subscribe({
                next: () => {
                    this.notificationService.show('Account created! Check your email for the verification code.', NotificationType.SUCCESS);
                    this.router.navigateByUrl('/login/verify-otp', { state: { email: dto.email } });
                },
                error: (err: any) => {
                    const msg = err?.body?.message || err?.message || 'Registration failed';
                    this.error.set(msg);
                    this.notificationService.show(msg, NotificationType.ERROR);
                },
            }).add(() => this.loading.set(false));
    }
}
