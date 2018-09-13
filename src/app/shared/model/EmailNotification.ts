import { ADNotification } from './ADNotification.class';
export class EmailNotification extends ADNotification {
  public constructor(init?: EmailNotification) {
    super(init);
    if (init)
      Object.assign(this, init);
  }
  notificationMessage: string = 'You have a new Email';
}