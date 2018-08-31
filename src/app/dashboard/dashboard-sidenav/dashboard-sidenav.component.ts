import { Component, OnInit, ViewEncapsulation, Output, ViewChild } from '@angular/core';
import { MenuModel } from '../../shared/ad-nav/ad-nav-menu/ad-nav-menu.service';
import {of as observableOf} from 'rxjs';
import { MENU_LIST } from "./dashbaord-sidenav.menu-list.model";
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-dashboard-sidenav',
  templateUrl: './dashboard-sidenav.component.html',
  styleUrls: ['./dashboard-sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSideNavComponent implements OnInit {

  @ViewChild(MatSidenav) sideNav: MatSidenav;
  public mainMenu: Partial<MenuModel>[];
  constructor() { 

    

  }
  ngOnInit() {
    this.mainMenu = MENU_LIST;
    
  }
  @Output()
  toggleSideNav(){
    console.log("left toggle")
    if(this.sideNav.opened){
    }
    else{
      
    }
    this.sideNav.toggle();
  }
  
 
}
