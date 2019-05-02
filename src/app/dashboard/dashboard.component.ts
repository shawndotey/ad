import { AppAuthorization } from '../shared/model/AppAuthorization.class';
import { environment } from '../../environments/environment';
import { Component, ViewEncapsulation, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BreakpointObserver,
  Breakpoints,
} from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth/auth.service';
import { MatSidenav } from '@angular/material';
import {
  faBars as sidenavMenuClosed,
  faCaretLeft as sidenavMenuOpen
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./scss/dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  sidenavMenuClosed = sidenavMenuClosed;
  sidenavMenuOpen = sidenavMenuOpen;
  layoutConfigurations = environment.layout;
  get isSideNavOpen(): boolean {
    return this.sideNav.opened;
  }

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService
  ) {
    authService.login();
    authService.authorizationChange$.subscribe({
      next: latestAuth => {
        Object.assign(this.appAuthorization, latestAuth);
      }
    });
  }
  appAuthorization: AppAuthorization = new AppAuthorization();
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  @Output()
  toggleSideNav() {
    this.sideNav.toggle();
  }
  ngAfterContentInit() {
    // setTimeout(()=>{
    //   console.log("close sideNav")
    //   this.sideNav.opened = false;
    // }, 1);
  }
}
