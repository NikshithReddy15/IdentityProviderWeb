import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RegistrationService } from '../services';
import { RegisterUserDto } from '../models';

@Component({
    selector: 'app-sign-up',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule],
    templateUrl: './sign-up.component.html'
})
export class SignUpComponent {
    protected signUpForm;
    protected submitted = false;
    protected loading = false;
    protected error: string | null = null;

    constructor(private readonly fb: FormBuilder, private readonly registrationService: RegistrationService, private readonly router: Router) {
        this.signUpForm = this.fb.nonNullable.group({
            firstName: ['', [Validators.required, Validators.maxLength(64)]],
            middleName: ['', Validators.maxLength(64)],
            lastName: ['', [Validators.required, Validators.maxLength(64)]],
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
        this.submitted = true;
        this.error = null;
        if (this.signUpForm.invalid) return;
        const vals = this.signUpForm.getRawValue();
        if (vals.password !== vals.confirmPassword) {
            this.error = 'Passwords do not match';
            return;
        }
        const dto: RegisterUserDto = {
            firstName: vals.firstName,
            middleName: vals.middleName ?? null,
            lastName: vals.lastName,
            email: vals.email,
            countryCode: vals.countryCode ?? null,
            mobileNumber: vals.mobileNumber ?? null,
            password: vals.password
        };

        this.loading = true;
        this.registrationService.register(dto)
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/login/sign-in');
                },
                error: (err: any) => {
                    this.error = err?.body?.message || err?.message || 'Registration failed';
                },
            }).add(() => (this.loading = false));
    }
}