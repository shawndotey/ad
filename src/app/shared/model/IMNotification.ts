import { ADNotification } from './ADNotification.class';
export class IMNotification extends ADNotification {
  public constructor(init?: IMNotification) {
    super(init);
    if (init)
      Object.assign(this, init);
  }
  notificationMessage: string = 'You have a new Instant Message';
}