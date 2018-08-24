import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }
  canActivate(): boolean {
    console.log('canActivate()')
    return this.standardDashboardCheck();
  }
  canActivateChild() {
    console.log('checking child route access');
    return this.standardDashboardCheck();
  }
  standardDashboardCheck(){

    if (!this.auth.isAuthenticated) {
      console.log('redirect to login')
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
