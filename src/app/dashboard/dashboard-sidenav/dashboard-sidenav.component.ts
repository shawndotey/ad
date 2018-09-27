import { AdNavMenuComponent } from './../../shared/ad-nav/ad-nav-menu/ad-nav-menu.component';
import { DashboardSidenavMenuListService } from './dashboard-sidenav.menu-list.service';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  Output,
  ViewChild,
  ContentChildren
} from '@angular/core';
import {
  MenuModel,
  MenuNode,
  MenuFlatNode
} from '../../shared/ad-nav/ad-nav-menu/ad-nav-menu.service';
import { of as observableOf, BehaviorSubject } from 'rxjs';
import { MatSidenav } from '@angular/material';
import {
  faDotCircle as defaultIcon,
  faChevronRight,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { FlatTreeControl } from '@angular/cdk/tree';
import * as clone from "clone-deep";
import { CustomMatTreeControl } from '../../shared/model/CustomMatTreeControl.class';

@Component({
  selector: 'app-dashboard-sidenav',
  templateUrl: './dashboard-sidenav.component.html',
  styleUrls: ['./dashboard-sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardSideNavComponent implements OnInit {
  @ViewChild(MatSidenav)
  sideNav: MatSidenav;
  @ViewChild(AdNavMenuComponent)
  adNavMenuComponent: AdNavMenuComponent;


  defaultIcon = defaultIcon;
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  treeControl: CustomMatTreeControl<MenuFlatNode>;
  @Output()
  isFreshView = true;
  public mainMenu: Partial<MenuModel>[];
  constructor(private menuList: DashboardSidenavMenuListService) {}
  ngOnInit() {
    this.mainMenu = this.menuList.MENU_LIST;
  }
  ngAfterContentInit() {
    
    this.adNavMenuComponent.menuData$.subscribe(data => {
      if(data.length === 0 ) return;
      this.treeControl = this.adNavMenuComponent.treeControl;

     
    //   // this.adNavMenuComponent.dataSource._data.subscribe(data=>{
    //   //   console.log('data data data', data)
    //   // });


      let nodeOfInterest = data.filter(n=> n.name === "Badge")[0]

      
      this.treeControl.expand(nodeOfInterest);
      this.treeControl.expandParents(nodeOfInterest);
     
    



    });
    this.isFreshView = false;
  }
  @Output()
  toggleSideNav() {
    this.sideNav.toggle();
  }
}
