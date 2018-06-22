import { Injectable } from '@angular/core';
import { MenuModel } from 'src/app/shared/ad-nav/ad-nav-menu/ad-nav-menu.service';


export interface MainMenu extends MenuModel{
  description:String;
  children?: Partial<MainMenu>[];
}


const DEFAULT_NEST_NODE_TEMPLATE_URL = '';
const DEFAULT_END_NODE_TEMPLATE_URL = '';
export const MENU_LIST:Partial<MainMenu>[] = [
  {
    name: 'Documentation',
    templateLocation:DEFAULT_NEST_NODE_TEMPLATE_URL,
    children: [
      {
        name: 'Angular',
        description:'Nan',
        templateLocation:DEFAULT_NEST_NODE_TEMPLATE_URL,
        children: [
              {
                name: 'Core',
                templateLocation:DEFAULT_END_NODE_TEMPLATE_URL
              },
              {
                name: 'Compiler',
                templateLocation:DEFAULT_END_NODE_TEMPLATE_URL
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
    templateLocation:DEFAULT_NEST_NODE_TEMPLATE_URL,
    children: [
      {
        name: 'Angular',
        templateLocation:DEFAULT_NEST_NODE_TEMPLATE_URL,
        children: [
              {
                name: 'Core',
                templateLocation:DEFAULT_END_NODE_TEMPLATE_URL
              },
              {
                name: 'Compiler',
                templateLocation:DEFAULT_END_NODE_TEMPLATE_URL
              }
        ]
      },
      {
        name: 'Applications'
      }
    ]
  },
  {
    name: 'Settings',
    templateLocation:DEFAULT_END_NODE_TEMPLATE_URL
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