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
import * as clone from 'clone-deep';
import { CustomMatTreeControl } from '../../shared/model/CustomMatTreeControl.class';
import {
  Router,
  ActivatedRoute,
  UrlTree,
  NavigationEnd
} from '@angular/router';
import { filter, first } from 'rxjs/operators';

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
  currentNodeMatchedToRouter: MenuFlatNode;
  @Output()
  isFreshView = true;
  public mainMenu: Partial<MenuModel>[];
  constructor(
    private menuList: DashboardSidenavMenuListService,
    private router: Router
  ) {}
  ngOnInit() {
    this.mainMenu = this.menuList.MENU_LIST;
  }
  syncRouteToNodes() {
    this.setCurrentNodeMatchedToRouter();
    this.expandNodesMatchingRouteTree();
  }
  setCurrentNodeMatchedToRouter() {
    if (!this.treeControl) return;
    this.currentNodeMatchedToRouter = this.treeControl.dataNodes.filter(node =>
      this.doesNodeMatchRoute(node)
    )[0];
  }
  doesNodeMatchRoute(node: MenuFlatNode): boolean {
    if (!node.route) return false;
    let routerSegments = this.getRelaventUrlSegmentStrings(
      this.router.parseUrl(this.router.url)
    );
    let nodeSegments = this.getRelaventUrlSegmentStrings(
      this.router.parseUrl(node.route)
    );

    return this.isUrlSegmentsMatching(nodeSegments, routerSegments);
  }

  expandNodesMatchingRouteTree() {
    if (!this.treeControl || !this.currentNodeMatchedToRouter) return;
    this.treeControl.expand(this.currentNodeMatchedToRouter);
    this.treeControl.expandParents(this.currentNodeMatchedToRouter);
  }
  ngAfterContentInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.syncRouteToNodes();
      });

    this.adNavMenuComponent.menuData$
      .pipe(filter(data => data && data.length !== 0))
      .subscribe(data => {
        this.treeControl = this.adNavMenuComponent.treeControl;

        this.syncRouteToNodes();
      });

    this.isFreshView = false;
  }

  isUrlSegmentsMatching(mustHave: string[], inThis: string[]): boolean {
    let inThisIndex = inThis.length - 1;
    for (let i = mustHave.length - 1; i > -1; i--) {
      if (inThis[inThisIndex] !== mustHave[i]) return false;
      inThisIndex--;
    }
    return true;
  }

  getRelaventUrlSegmentStrings(urlTree: UrlTree): string[] {
    return urlTree.root.children.primary.segments
      .filter(seg => seg.path !== '.')
      .map(seg => {
        return seg.path;
      });
  }
  @Output()
  toggleSideNav() {
    this.sideNav.toggle();
  }
}
