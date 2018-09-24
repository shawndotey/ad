import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ContentChild,
  Renderer,
  AfterContentInit,
  TemplateRef
} from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject } from 'rxjs';
import { MatTreeFlatDataSource } from '@angular/material/tree';

import {
  AdNavMenuService,
  MenuNode,
  MenuFlatNode,
  MenuModel
} from './ad-nav-menu.service';
import { AdNavItemDirective } from '../ad-nav-item/ad-nav-item.directive';
import { AdNavNesterDirective } from '../ad-nav-nester/ad-nav-nester.directive';

@Component({
  selector: 'ad-nav-menu',
  templateUrl: './ad-nav-menu.component.html',
  styleUrls: ['./ad-nav-menu.component.scss'],
  providers: [AdNavMenuService]
})
export class AdNavMenuComponent implements OnInit, AfterContentInit {
  @Input()
  menuSource: Partial<MenuModel>[];

  @ContentChild(AdNavNesterDirective)
  nesterTemplate;
  @ContentChild(AdNavItemDirective)
  menuItemTemplate;
  dataSource: MatTreeFlatDataSource<MenuNode, MenuFlatNode>;

  menuData$: BehaviorSubject<MenuNode[]> = new BehaviorSubject<MenuNode[]>([]);
  treeControl: FlatTreeControl<MenuFlatNode>;

  constructor(private navMenuService: AdNavMenuService) {}

  ngOnInit() {
    this.treeControl = this.navMenuService.buildTreeControl();
    this.dataSource = this.navMenuService.buildDataSource(this.treeControl);
    this.subscribeData();
  }

  subscribeData() {
    let data: MenuNode[] = this.navMenuService.buildMenuTree(this.menuSource);
    this.menuData$.subscribe(data => {
      this.dataSource.data = data;
    });
    this.menuData$.next(data);
  }
  ngAfterContentInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
  }
  isMenuExpandable(_: number, _nodeData: MenuFlatNode) {
    return _nodeData.isExpandable;
  }
}
