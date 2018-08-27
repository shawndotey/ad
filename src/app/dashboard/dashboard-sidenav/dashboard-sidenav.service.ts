import { Injectable } from '@angular/core';
import { MenuModel } from '../../shared/ad-nav/ad-nav-menu/ad-nav-menu.service';


export interface MainMenu extends MenuModel {
  description: String;
  route:string;
  children?: Partial<MainMenu>[];
}



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