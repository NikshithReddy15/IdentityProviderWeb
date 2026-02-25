import { Component, signal } from '@angular/core';
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
}
