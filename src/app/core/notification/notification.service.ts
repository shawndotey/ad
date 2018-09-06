import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { concat, map } from 'rxjs/operators';

export enum NoticationType {
  General = 'general',
  Email = 'message',
  InstantMessage = 'im',
  ToDo = 'todo'
}

export class Notification {
  public constructor(init?: Notification) {
    if (init) Object.assign(this, init);
  }
  notificationType?: NoticationType = NoticationType.General;
  notificationMessage?: string = 'You have a new notification';
  notificationDetails?: string = '';
  isNotificationRead?: boolean = false;
}
export class EmailNotification extends Notification {
  public constructor(init?: EmailNotification) {
    super(init);
    if (init) Object.assign(this, init);
  }
  notificationMessage: string = 'You have a new Email';
}
export class IMNotification extends Notification {
  public constructor(init?: IMNotification) {
    super(init);
    if (init) Object.assign(this, init);
  }
  notificationMessage: string = 'You have a new Instant Message';
}

export class ToDoNotification extends Notification {
  public constructor(init?: ToDoNotification) {
    super(init);
    if (init) Object.assign(this, init);
  }
  notificationMessage: string = 'You have a new Task';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  genericNotifications$: Observable<Notification[]>;
  emailNotifications$: Observable<EmailNotification[]>;
  imNotifications$: Observable<IMNotification[]>;
  toDoNotifications$: Observable<ToDoNotification[]>;
  allNotifications$: Observable<Notification[]>;
  constructor() {
    console.log('constructor NotificationService')
    this.genericNotifications$ = interval(1000).pipe(
      map(a => {
        return new Array(
          new Notification(<Notification>{
            notificationDetails: 'this is genericNotifications ' + a
          })
        );
      })
    );
    this.emailNotifications$ = new Observable<EmailNotification[]>(() => {});
    this.imNotifications$ = new Observable<IMNotification[]>(() => {});
    this.toDoNotifications$ = new Observable<ToDoNotification[]>(() => {});
    this.allNotifications$ = new Observable<Notification[]>(() => {}).pipe(
      concat(
        this.genericNotifications$,
        this.emailNotifications$,
        this.imNotifications$,
        this.toDoNotifications$
      )
    );

    this.allNotifications$.subscribe(v => {
      //console.log('allNotifications',v);
    });
    this.genericNotifications$.subscribe(v => {
      //console.log('genericNotifications', v);
    });
  }
  hello(){
    //console.log('NotificationService hello')
  }
}
