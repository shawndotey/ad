import { Component, OnInit, Injectable, ViewChild, AfterViewInit  } from '@angular/core';
import { getOrCreateChangeDetectorRef } from '@angular/core/src/render3/di';
 


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {

  constructor() {
   
}
  ngOnInit() {
  }
 
  
 

  
  ngAfterViewInit(): void {
      //  Do something with AdGrid instance here
  }

  

 
}




