import { Component, OnInit, ContentChild, Output, ViewChild, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { DemoToggleButtonComponent } from './demo-toggle-button/demo-toggle-button.component';

@Component({
  selector: 'app-dashboard-demo-sidenav',
  templateUrl: './dashboard-demo-sidenav.component.html',
  styleUrls: ['./dashboard-demo-sidenav.component.scss']
})
export class DashboardDemoSidenavComponent implements OnInit {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  @ViewChild(DemoToggleButtonComponent) settingsIcon: DemoToggleButtonComponent;
  constructor() { }
  
  ngOnInit() {
  }
  @Output()
  toggleSideNav(){
    if(this.sideNav.opened){
      this.settingsIcon.close();
    }
    else{
      this.settingsIcon.open();
    }
    this.sideNav.toggle();
  }
  onDemoButtonPressed(isOpen){
    if(isOpen){
      this.sideNav.open();
    }
    else{
      this.sideNav.close();
    }

  }
}
