import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../core/notification/notification.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private notificationService: NotificationService) {

   }

  ngOnInit() {
  }

}
