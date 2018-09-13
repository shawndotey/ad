import { Observable, BehaviorSubject } from "rxjs";

import { ADNotification } from "../../../model/ADNotification.class";

export class MenuModel {
  constructor(init?: Partial<MenuModel>) {
    Object.assign(this, init);
    
  }

  name: string;
  children?: MenuModel[];
  
}