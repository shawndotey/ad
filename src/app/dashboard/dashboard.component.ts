import { AppAuthorization } from '../shared/model/AppAuthorization.class';

import { Component, ViewEncapsulation, Output, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';
import { IAppAuthorization } from '../shared/model/IAppAuthorization.interface';
import { MatSidenav } from '@angular/material';
import {faBars, faTimes} from '@fortawesome/free-solid-svg-icons'


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  faBars = faBars;
  faTimes = faTimes;
  get isSideNavOpen(): boolean {

    return this.sideNav.opened;
  }
  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {

    authService.login();
    authService.authorizationChange$.subscribe({
      next: (latestAuth) =>{
        Object.assign(this.appAuthorization, latestAuth);
      }
    })
   
    
  }
  appAuthorization:AppAuthorization = new AppAuthorization();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  onAppAuthorizationSlideToggle(event){
    let {checked} = event;
    if(checked){
      this.authService.login();
    }
    else{
      this.authService.logout();
    }
    
  }
  @Output()
  toggleSideNav(){
    this.sideNav.toggle();
  }
}