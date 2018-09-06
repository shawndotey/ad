import { Component, OnInit, Injectable, ViewChild, AfterViewInit  } from '@angular/core';
import { getOrCreateChangeDetectorRef } from '@angular/core/src/render3/di';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../core/notification/notification.service';
 


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[
    //NotificationService
  ]

})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private notificationService: NotificationService) {
   
}
  ngOnInit() {
    this.notificationService.hello();
  }
 
  
 

  
  ngAfterViewInit(): void {
      //  Do something with AdGrid instance here
  }

 
 
}




