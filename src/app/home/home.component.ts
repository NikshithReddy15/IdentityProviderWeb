import { Component, inject } from '@angular/core';

import { AuthService } from '../shared/services/auth/auth.service';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
})
export class HomeComponent {
    private readonly authService = inject(AuthService);

    logout(): void {
        this.authService.logout().subscribe();
    }
}
