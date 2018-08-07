import { MenuModel } from '../../shared/ad-nav/ad-nav-menu/ad-nav-menu.service';
import { Component, OnInit } from '@angular/core';
import {of as observableOf} from 'rxjs';
import {MENU_LIST} from './dashboard-sidenav.service';

@Component({
  selector: 'app-dashboard-sidenav',
  templateUrl: './dashboard-sidenav.component.html',
  styleUrls: ['./dashboard-sidenav.component.scss']
})
export class AppDashboardSideNavComponent implements OnInit {

  
  public mainMenu: Partial<MenuModel>[];
  
  constructor() { 

    

  }
  ngOnInit() {
    this.mainMenu = MENU_LIST;
    
  }
  
 
}
