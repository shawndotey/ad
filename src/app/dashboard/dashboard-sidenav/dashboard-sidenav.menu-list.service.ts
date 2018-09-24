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
            name: 'Auto Complete',
            route: './material2/autocomplete',
            
          },
          {name: 'Autocomplete', route: './material2/autocomplete'},
          {name: 'Badge', route: './material2/badge'},
          {name: 'Bottom sheet', route: './material2/bottom-sheet'},
          {name: 'Button Toggle', route: './material2/button-toggle'},
          {name: 'Button', route: './material2/button'},
          {name: 'Card', route: './material2/card'},
          {name: 'Chips', route: './material2/chips'},
          {name: 'Connected Overlay', route: './material2/connected-overlay'},
          {name: 'Checkbox', route: './material2/checkbox'},
          {name: 'Chips', route: './material2/chips'},
          {name: 'Datepicker', route: './material2/datepicker'},
          {name: 'Dialog', route: './material2/dialog'},
          {name: 'Drawer', route: './material2/drawer'},
          {name: 'Expansion Panel', route: './material2/expansion'},
          {name: 'Focus Origin', route: './material2/focus-origin'},
          {name: 'Gestures', route: './material2/gestures'},
          {name: 'Grid List', route: './material2/grid-list'},
          {name: 'Icon', route: './material2/icon'},
          {name: 'Input', route: './material2/input'},
          {name: 'List', route: './material2/list'},
          {name: 'Live Announcer', route: './material2/live-announcer'},
          {name: 'Menu', route: './material2/menu'},
          {name: 'Paginator', route: './material2/paginator'},
          {name: 'Platform', route: './material2/platform'},
          {name: 'Portal', route: './material2/portal'},
          {name: 'Progress Bar', route: './material2/progress-bar'},
          {name: 'Progress Spinner', route: './material2/progress-spinner'},
          {name: 'Radio', route: './material2/radio'},
          {name: 'Ripple', route: './material2/ripple'},
          {name: 'Screen Type', route: './material2/screen-type'},
          {name: 'Select', route: './material2/select'},
          {name: 'Sidenav', route: './material2/sidenav'},
          {name: 'Slide Toggle', route: './material2/slide-toggle'},
          {name: 'Slider', route: './material2/slider'},
          {name: 'Snack Bar', route: './material2/snack-bar'},
          {name: 'Stepper', route: './material2/stepper'},
          {name: 'Table', route: './material2/table'},
          {name: 'Tabs', route: './material2/tabs'},
          {name: 'Toolbar', route: './material2/toolbar'},
          {name: 'Tooltip', route: './material2/tooltip'},
          {name: 'Tree', route: './material2/tree'},
          {name: 'Typography', route: './material2/typography'}
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

