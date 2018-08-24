import { Injectable } from '@angular/core';
import { MenuModel } from '../../shared/ad-nav/ad-nav-menu/ad-nav-menu.service';


export interface MainMenu extends MenuModel {
  description: String;
  route:string;
  children?: Partial<MainMenu>[];
}



export const MENU_LIST: Partial<MainMenu>[] = [
  {
    name: 'Documentation',
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
    name: 'Examples',
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
    name: 'Login',
    route: '/login'
  },
  {
    name: 'Home',
    route: './home'
  },
  {
    name: 'About',
    route: './about'
  },
]




@Injectable({
  providedIn: 'root',
})
export class AppDashboardSideNavService {

  constructor() {
    this.initialize();
  }
  initialize() {

  }

}