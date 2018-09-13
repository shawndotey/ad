import { ADNotification } from './ADNotification.class';
export class ToDoNotification extends ADNotification {
  public constructor(init?: ToDoNotification) {
    super(init);
    if (init)
      Object.assign(this, init);
  }
  notificationMessage: string = 'You have a new Task';
}