import { Component, OnInit, Injectable, ViewChild, AfterViewInit  } from '@angular/core';
import { getOrCreateChangeDetectorRef } from '@angular/core/src/render3/di';
import { ActivatedRoute, Router } from '@angular/router';
 


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {
   
}
  ngOnInit() {
  }
 
  
 

  
  ngAfterViewInit(): void {
      //  Do something with AdGrid instance here
  }

 
 
}




