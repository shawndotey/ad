import { NotificationType } from './NotificationType.enum';
export class ADNotification {
  public constructor(init?: ADNotification) {
    if (init)
      Object.assign(this, init);
  }
  notificationType?: NotificationType = NotificationType.General;
  notificationMessage?: string = 'You have a new notification';
  notificationDetails?: string = '';
  isNotificationRead?: boolean = false;
}