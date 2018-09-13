import { DashboardSidenavMenuListService } from './dashboard-sidenav.menu-list.service';
import { Component, OnInit, ViewEncapsulation, Output, ViewChild } from '@angular/core';
import { MenuModel } from '../../shared/ad-nav/ad-nav-menu/ad-nav-menu.service';
import {of as observableOf} from 'rxjs';
import { MatSidenav } from '@angular/material';
import {faQuestion as defaultIcon, faChevronRight, faChevronDown} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-sidenav',
  templateUrl: './dashboard-sidenav.component.html',
  styleUrls: ['./dashboard-sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSideNavComponent implements OnInit {

  @ViewChild(MatSidenav) sideNav: MatSidenav;
  defaultIcon = defaultIcon;
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  @Output() isFreshView = true;
  public mainMenu: Partial<MenuModel>[];
  constructor(private menuList:DashboardSidenavMenuListService) { 

    

  }
  ngOnInit() {
    this.mainMenu = this.menuList.MENU_LIST;
    
  }
  ngAfterContentInit(){
   
    setTimeout(() => {
      this.isFreshView = false;
    }, 500);
   
  }
  @Output()
  toggleSideNav(){
    
    if(this.sideNav.opened){
    }
    else{
      
    }
    this.sideNav.toggle();
  }
  
 
}
