import { MenuFlatNode } from './shared/MenuFlatNode.class';
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ContentChild,
  Renderer,
  AfterContentInit,
  TemplateRef,
  Output,
  ContentChildren
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatTreeFlatDataSource } from '@angular/material/tree';

import {
  AdNavMenuService,
  MenuNode,
  MenuModel
} from './ad-nav-menu.service';
import { AdNavItemDirective } from '../ad-nav-item/ad-nav-item.directive';
import { AdNavNesterDirective } from '../ad-nav-nester/ad-nav-nester.directive';
import { CustomMatTreeControl } from '../../model/CustomMatTreeControl.class';
import { RouterLink } from '@angular/router';

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
  menuData$: BehaviorSubject<MenuFlatNode[]> = new BehaviorSubject<
    MenuFlatNode[]
  >([]);
  treeControl: CustomMatTreeControl<MenuFlatNode>;
  

  constructor(private navMenuService: AdNavMenuService) {}

  @ContentChildren(RouterLink, {descendants:true}) linkRefs:RouterLink[];

  ngOnInit() {
    this.treeControl = this.navMenuService.buildTreeControl();
    this.dataSource = this.navMenuService.buildDataSource(this.treeControl);
    this.subscribeData();
  }

  subscribeData() {
    this.dataSource._flattenedData.subscribe(flatData => {
      // Material's FlatTreeControl does not have an emmiter to tell you when it's [dataNodes] is updated so we have to do it this way to ensure FlatTreeControl has had a cycle to update
      setTimeout(() => {
        this.menuData$.next(flatData);
      });
    });
    // this.treeControl.expansionModel.onChange.subscribe(stuff=>{

    //   console.log('expansionModel', stuff)
    // })
    let data: MenuNode[] = this.navMenuService.buildMenuTree(this.menuSource);
    
    // this.menuData$.next(this.dataSource.data);
    // this.dataSource._flattenedData.subscribe(data=>{
    //   console.log('dataSource data internal', data)
    //   this.menuData$.next(data);
    // });
    this.dataSource.data = data;
    // this.menuData$.subscribe(data => {
    //   ///console.log('menu data from ad-nav-menu', data)

    // });
    // this.dataSource._data.next(data)

   
  }
  ngAfterContentInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    
    this.linkRefs.forEach(link=>{
      
    })
  }
  isMenuExpandable(_: number, _nodeData: MenuFlatNode) {
    return _nodeData.isExpandable;
  }
  isNodeSelected(menuNode:MenuFlatNode):boolean{

    //return this.treeControl.expansionModel.isSelected(menuNode);
    return true;
  }
}
