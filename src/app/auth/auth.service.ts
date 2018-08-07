import { Injectable } from '@angular/core';
// import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor() {}
  // ...
  public isAuthenticated(): boolean {
    console.log('isAuthenticated()')
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !!token;
  }
}
