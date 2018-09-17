import { Component, OnInit, ContentChild, Output, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { DemoToggleButtonComponent } from './demo-toggle-button/demo-toggle-button.component';
import { AppAuthorization } from '../../shared/model/AppAuthorization.class';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard-demo-sidenav',
  templateUrl: './dashboard-demo-sidenav.component.html',
  styleUrls: ['./dashboard-demo-sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDemoSidenavComponent implements OnInit {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  @ViewChild(DemoToggleButtonComponent) settingsIcon: DemoToggleButtonComponent;
  appAuthorization:AppAuthorization = new AppAuthorization();
  constructor(private authService: AuthService) { 
    
  }
  
  ngOnInit() {
    this.sideNav.close();
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
  appAuthorizationSlideToggle(event){
    let {checked} = event;
    if(checked){
      this.authService.login();
    }
    else{
      this.authService.logout();
    }
    
  }
}
