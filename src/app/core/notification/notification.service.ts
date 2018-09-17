import { Injectable } from '@angular/core';
import {
  Observable,
  interval,
  timer,
  of,
  from,
  merge,
  BehaviorSubject
} from 'rxjs';
import { concat, map, delay, mergeMap } from 'rxjs/operators';
import { ADNotification } from '../../shared/model/ADNotification.class';
import { EmailNotification } from '../../shared/model/EmailNotification';
import { IMNotification } from '../../shared/model/IMNotification';
import { ToDoNotification } from '../../shared/model/ToDoNotification';
import { NotificationHttpService } from './notification.mock-http.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  genericNotifications$: BehaviorSubject<ADNotification[]>;
  emailNotifications$: BehaviorSubject<EmailNotification[]>;
  imNotifications$: BehaviorSubject<IMNotification[]>;
  toDoNotifications$: BehaviorSubject<ToDoNotification[]>;
  allNotifications$: BehaviorSubject<ADNotification[]>;
  constructor(notificationHttpService: NotificationHttpService) {
    this.allNotifications$ = new BehaviorSubject<IMNotification[]>([]);
    notificationHttpService.allHttpNotifications$.subscribe(
      notificationsArray => {
        this.allNotifications$.next(notificationsArray);
      }
    );

    this.genericNotifications$ = new BehaviorSubject<IMNotification[]>([]);
    this.emailNotifications$ = new BehaviorSubject<IMNotification[]>([]);
    this.imNotifications$ = new BehaviorSubject<IMNotification[]>([]);
    this.toDoNotifications$ = new BehaviorSubject<IMNotification[]>([]);
  }
}
