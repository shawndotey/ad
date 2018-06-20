import { MenuModel } from 'src/app/shared/ad-nav/ad-nav-menu/ad-nav-menu.service';
import { Component, OnInit } from '@angular/core';
import {of as observableOf} from 'rxjs';
import {MENU_LIST} from './ad-dashboard-sidenav.service';

@Component({
  selector: 'ad-dashboard-sidenav',
  templateUrl: './ad-dashboard-sidenav.component.html',
  styleUrls: ['./ad-dashboard-sidenav.component.scss']
})
export class AdDashboardSideNavComponent implements OnInit {

  
  public mainMenu: Partial<MenuModel>[];
  
  constructor() { 

    

  }
  ngOnInit() {
    this.mainMenu = MENU_LIST;
  }
  
 
}
