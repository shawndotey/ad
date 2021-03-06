/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, OnInit} from '@angular/core';
import {Observable, Observer} from 'rxjs';


export interface DemoTab {
  content: string;
  disabled?: boolean;
  extraContent?: boolean;
  label: string;
}

@Component({
  moduleId: module.id,
  selector: 'tabs-demo',
  templateUrl: 'tabs-demo.html',
  styleUrls: ['tabs-demo.scss'],
})
export class TabsDemo {
  // Nav bar demo
  tabLinks: {label: string, link: string}[] = [
    {label: 'Sun', link: 'sunny-tab'},
    {label: 'Rain', link: 'rainy-tab'},
    {label: 'Fog', link: 'foggy-tab'},
  ];

  tabNavBackground: string | undefined = undefined;

  // Standard tabs demo
  tabs: DemoTab[] = [
    {
      label: 'Tab 1',
      content: 'This is the body of the first tab'
    }, {
      label: 'Tab 2',
      disabled: true,
      content: 'This is the body of the second tab'
    }, {
      label: 'Tab 3',
      extraContent: true,
      content: 'This is the body of the third tab'
    }, {
      label: 'Tab 4',
      content: 'This is the body of the fourth tab'
    },
  ];

  // Dynamic tabs demo
  activeTabIndex = 0;
  addTabPosition = 0;
  gotoNewTabAfterAdding = false;
  createWithLongContent = false;
  dynamicTabs: DemoTab[] = [
    {
      label: 'Tab 1',
      content: 'This is the body of the first tab'
    }, {
      label: 'Tab 2',
      disabled: true,
      content: 'This is the body of the second tab'
    }, {
      label: 'Tab 3',
      extraContent: true,
      content: 'This is the body of the third tab'
    }, {
      label: 'Tab 4',
      content: 'This is the body of the fourth tab'
    },
  ];

  asyncTabs: Observable<DemoTab[]>;

  constructor() {
    this.asyncTabs = Observable.create((observer: Observer<DemoTab[]>) => {
      setTimeout(() => {
        observer.next(this.tabs);
      }, 1000);
    });
  }

  addTab(includeExtraContent: boolean): void {
    this.dynamicTabs.splice(this.addTabPosition, 0, {
      label: 'New Tab ' + (this.dynamicTabs.length + 1),
      content: 'New tab contents ' + (this.dynamicTabs.length + 1),
      extraContent: includeExtraContent
    });

    if (this.gotoNewTabAfterAdding) {
      this.activeTabIndex = this.addTabPosition;
    }
  }

  deleteTab(tab: DemoTab) {
    this.dynamicTabs.splice(this.dynamicTabs.indexOf(tab), 1);
  }

  swapTabLinks() {
    const temp = this.tabLinks[0];
    this.tabLinks[0] = this.tabLinks[1];
    this.tabLinks[1] = temp;
  }

  addToLabel() {
    this.tabLinks.forEach(link => link.label += 'extracontent');
  }

  toggleBackground() {
    this.tabNavBackground = this.tabNavBackground || 'primary';
  }
}


@Component({
  moduleId: module.id,
  selector: 'sunny-routed-content',
  template: 'This is the routed body of the sunny tab.',
})
export class SunnyTabContent {}


@Component({
  moduleId: module.id,
  selector: 'rainy-routed-content',
  template: 'This is the routed body of the rainy tab.',
})
export class RainyTabContent {}


@Component({
  moduleId: module.id,
  selector: 'foggy-routed-content',
  template: 'This is the routed body of the foggy tab.',
})
export class FoggyTabContent {}


@Component({
  moduleId: module.id,
  selector: 'counter',
  template: `<span>Content</span>`
})
export class Counter implements OnInit {
  ngOnInit() {
    console.log('Tab Loaded');
  }
}
