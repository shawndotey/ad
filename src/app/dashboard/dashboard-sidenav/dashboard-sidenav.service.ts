import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MenuModel } from '../../shared/ad-nav/ad-nav-menu/ad-nav-menu.service';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';


export interface MainMenu extends MenuModel {
  description: String;
  route:string;
  icon:IconDefinition;
  children?: Partial<MainMenu>[];
  badge?: Observable<string>;
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