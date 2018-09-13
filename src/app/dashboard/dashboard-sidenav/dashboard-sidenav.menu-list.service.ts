import { Injectable } from '@angular/core';
import { NotificationService } from '../../core/notification/notification.service';
import { MainMenu } from "./dashboard-sidenav.MainMenu.model";
import { faHome, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root'
})
export class DashboardSidenavMenuListService {
  MENU_LIST: MainMenu[];
  constructor(private notificationService: NotificationService) { 
    let MENU_LIST=<MainMenu[]> [
      {
        name: 'Home',
        route: './home',
        icon:faHome
      },
      {
        
        name: 'Angular Material 2',
        children: [
          {
            name: 'Angular',
            description: 'Nan',
            children: [
              {
                name: 'Core',
    
              },
              {
                name: 'Compiler',
              }
            ]
          },
          {
            name: 'Applications'
          }
        ]
      },
      {
        name: 'Bootstrap 4',
        children: [
          {
            name: 'Angular',
            children: [
              {
                name: 'Core'
              },
              {
                name: 'Compiler'
              }
            ]
          },
          {
            name: 'Applications'
          }
        ]
      },
      
      {
        name: 'About',
        route: './about',
        icon:faInfoCircle
      },
      {
        name: 'Notifications',
        route: './notifications',
        icon:faInfoCircle,
        badge:this.notificationService.allNotifications$
      },
    ];
  
    this.MENU_LIST = this.mapMenuListToClass(<MainMenu[]>MENU_LIST);
  }
  mapMenuListToClass(menuList: MainMenu[]): MainMenu[] {
    return menuList.map<MainMenu>(menuItem => {
      if (menuItem.children && menuItem.children.length)
      menuItem.children = this.mapMenuListToClass(menuItem.children);
      return new MainMenu(menuItem);
    })
  }
}

