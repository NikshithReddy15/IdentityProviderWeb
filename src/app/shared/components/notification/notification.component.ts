import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationType } from '../../models/notification-type.enum';

@Component({
    selector: 'app-notifications',
    standalone: true,
    templateUrl: './notification.component.html',
    styles: [`
    :host { position: fixed; top: 12px; right: 12px; z-index: 30; }
    .notifications-wrapper { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
    .notification { display: flex; align-items: center; min-width: 280px; max-width: 360px; padding: 10px 12px; border-radius: 10px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); color: #0b1226; background: #fff; border-left: 4px solid transparent; }
    .success { border-left-color: #34c759; }
    .success .icon { color: #34c759; }
    .error { border-left-color: #ff3b30; }
    .error .icon { color: #ff3b30; }
    .warning { border-left-color: #ff9500; }
    .warning .icon { color: #ff9500; }
    .info { border-left-color: #007aff; }
    .info .icon { color: #007aff; }
    .icon { font-size: 14px; margin-right: 8px; }
    .message { flex: 1; font-size: 14px; }
    .close { background: transparent; border: none; color: inherit; font-size: 14px; cursor: pointer; }
    `]
})
export class NotificationComponent {
    protected readonly notificationService = inject(NotificationService);

    getNotificationTypeIcon(type: NotificationType) {
        switch (type) {
            case NotificationType.SUCCESS:
                return 'bi bi-check-circle-fill';
            case NotificationType.ERROR:
                return 'bi bi-x-circle-fill';
            case NotificationType.WARNING:
                return 'bi bi-exclamation-triangle-fill';
            case NotificationType.INFO:
                return 'bi bi-info-circle-fill';
        }
    }

    getNotificationTypeClass(type: NotificationType) {
        switch (type) {
            case NotificationType.SUCCESS:
                return 'success';
            case NotificationType.ERROR:
                return 'error';
            case NotificationType.WARNING:
                return 'warning';
            case NotificationType.INFO:
                return 'info';
        }
    }

    dismiss(id: number) {
        this.notificationService.dismiss(id);
    }
}
