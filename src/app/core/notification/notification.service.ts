import { Injectable } from '@angular/core';
import { Observable, interval, timer, of, from, merge, BehaviorSubject } from 'rxjs';
import { concat, map, delay, mergeMap  } from 'rxjs/operators';
import { ADNotification } from '../../shared/model/ADNotification.class';
import { EmailNotification } from '../../shared/model/EmailNotification';
import { IMNotification } from '../../shared/model/IMNotification';
import { ToDoNotification } from '../../shared/model/ToDoNotification';
import { NotificationHttpService } from './notification.mock-http.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  genericNotifications$: BehaviorSubject<ADNotification[]>;
  emailNotifications$: BehaviorSubject<EmailNotification[]>;
  imNotifications$: BehaviorSubject<IMNotification[]>;
  toDoNotifications$: BehaviorSubject<ToDoNotification[]>;
  allNotifications$: BehaviorSubject<ADNotification[]>;
  constructor(notificationHttpService:NotificationHttpService) {
    console.log('constructor NotificationService');

    
    
    this.allNotifications$ = new BehaviorSubject<IMNotification[]>([]);
    notificationHttpService.allHttpNotifications$.subscribe(notificationsArray=>{
      console.log('allHttpNotifications subscribe internal')
      this.allNotifications$.next(notificationsArray);
    })

    this.genericNotifications$ = new BehaviorSubject<IMNotification[]>([]);
    this.emailNotifications$ = new BehaviorSubject<IMNotification[]>([]);
    this.imNotifications$ = new BehaviorSubject<IMNotification[]>([]);
    this.toDoNotifications$ = new BehaviorSubject<IMNotification[]>([]);


  //   this.allNotifications$.subscribe(v => {
  //     console.log('allNotifications',v);
  //   },function (err) {
  //     console.log('Error: ' + err);   
  // },);

    // this.toDoNotifications$.subscribe(v => {
    //   console.log('toDoNotifications',v);
    // });


    // this.genericNotifications$.subscribe(v => {
    //   console.log('genericNotifications', v);
    // });
    // this.emailNotifications$.subscribe(v => {
    //   console.log('emailNotifications', v);
    // });


    // this.imNotifications$.subscribe(v => {
    //     console.log('imNotifications', v);
    //   });

    // const sourceOne = of(1, 2, 3);//.pipe(timer(1500));
    // //emits 4,5,6
    // const sourceTwo = of(4, 5, 6);
    // //emit values from sourceOne, when complete, subscribe to sourceTwo
    // const example = sourceOne.pipe(concat(sourceTwo));
    // //output: 1,2,3,4,5,6
    // const subscribe = example.subscribe(val =>
    //   console.log('Example: Basic concat:', val)
    // );
  }
  hello() {
    //console.log('NotificationService hello')
  }
}
