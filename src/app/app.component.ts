import { Component, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NotificationComponent],
    templateUrl: './app.component.html',
})
export class AppComponent {
    protected readonly title = signal('Chat Application');
    protected readonly darkMode = signal(false);

    private readonly platformId = inject(PLATFORM_ID);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const stored = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.darkMode.set(stored ? stored === 'dark' : prefersDark);
        }

        effect(() => {
            if (isPlatformBrowser(this.platformId)) {
                const theme = this.darkMode() ? 'dark' : 'light';
                document.documentElement.setAttribute('data-bs-theme', theme);
                localStorage.setItem('theme', theme);
            }
        });
    }

    toggleTheme(): void {
        this.darkMode.update(v => !v);
    }
}
