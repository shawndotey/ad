import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  faGoogle = faGoogle;
  faFacebook = faFacebook;
  constructor(public auth: AuthService, public router: Router) {

  }
  ngOnInit() {
    
  }
  goLogin(goHere: string) {
    this.auth.login();
    this.router.navigate([goHere]);
  }
}
