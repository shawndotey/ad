import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ADNotification } from '../../shared/model/ADNotification.class';
import { IMNotification } from '../../shared/model/IMNotification';
import { EmailNotification } from '../../shared/model/EmailNotification';
import { ToDoNotification } from '../../shared/model/ToDoNotification';

@Injectable({
  providedIn: 'root'
})
export class NotificationHttpService {
  allHttpNotifications$: Observable<ADNotification[]>;
  private allNotifications:ADNotification[] = [];
  constructor() { 

    this.allHttpNotifications$ = timer(2000, 2000)
    .pipe(
      map(a => {
        let randomNumber = Math.floor(Math.random() * 8) - 4; 

        for(let i = 0; i < randomNumber;i++){
          this.allNotifications.push(this.generateRandomNotification())
        }
        // console.log('genericNotifications internal', a)
        return this.allNotifications;
      }),
      take(50)
    );


  }
  generateRandomNotification(){
    let randomNumber = Math.floor(Math.random() * 4) + 1 
    if(randomNumber == 1){
      return new EmailNotification(<EmailNotification>{
        notificationDetails: 'this is EmailNotification '
      })
    } 
    if(randomNumber == 2){
      return new IMNotification(<IMNotification>{
        notificationDetails: 'this is IMNotification '
      })
    }
    if(randomNumber == 3){
      return new ToDoNotification(<ToDoNotification>{
        notificationDetails: 'this is ToDoNotification '
      })
    }
    if(randomNumber == 4){
      return new ADNotification(<ADNotification>{
        notificationDetails: 'this is ADNotification'
      })
    }
  }
}
