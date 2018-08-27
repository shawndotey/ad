import { MenuModel } from '../../shared/ad-nav/ad-nav-menu/ad-nav-menu.service';
import { Component, OnInit } from '@angular/core';
import {of as observableOf} from 'rxjs';
import { MENU_LIST } from "./dashbaord-sidenav.menu-list.model";

@Component({
  selector: 'app-dashboard-sidenav',
  templateUrl: './dashboard-sidenav.component.html',
  styleUrls: ['./dashboard-sidenav.component.scss']
})
export class DashboardSideNavComponent implements OnInit {

  
  public mainMenu: Partial<MenuModel>[];
  
  constructor() { 

    

  }
  ngOnInit() {
    this.mainMenu = MENU_LIST;
    
  }
  
 
}
