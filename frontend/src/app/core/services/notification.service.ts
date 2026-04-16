import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();
  private idCounter = 0;

  addNotification(type: Notification['type'], title: string, message: string): void {
    const notification: Notification = {
      id: ++this.idCounter,
      type, title, message,
      timestamp: new Date(),
      read: false
    };
    const current = this.notifications.value;
    this.notifications.next([notification, ...current].slice(0, 50));
  }

  markAsRead(id: number): void {
    const updated = this.notifications.value.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications.next(updated);
  }

  markAllAsRead(): void {
    const updated = this.notifications.value.map(n => ({ ...n, read: true }));
    this.notifications.next(updated);
  }

  getUnreadCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }

  clearAll(): void {
    this.notifications.next([]);
  }
}
