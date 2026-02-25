import { Injectable, OnDestroy, signal } from '@angular/core';
import { NotificationType } from '../../models/notification-type.enum';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService implements OnDestroy {
    private readonly _notifications = signal<Notification[]>([]);
    readonly notifications = this._notifications.asReadonly();
    private nextId = 1;

    show(message: string, type: NotificationType = NotificationType.INFO): number {
        const id = this.nextId++;
        this._notifications.update(list => [...list, { id, message, type }]);
        setTimeout(() => this.dismiss(id), 5000);
        return id;
    }

    dismiss(id: number) {
        this._notifications.update(list => list.filter(n => n.id !== id));
    }

    ngOnDestroy(): void {}
}
