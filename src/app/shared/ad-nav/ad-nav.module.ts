import { MaterialModule } from 'src/app/shared/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AdNavMenuComponent} from './ad-nav-menu/ad-nav-menu.component';
import { AdNavNesterDirective } from './ad-nav-nester/ad-nav-nester.directive';
import { AdNavItemDirective } from './ad-nav-item/ad-nav-item.directive';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    AdNavMenuComponent,
    AdNavNesterDirective,
    AdNavItemDirective
  ],
  exports:[
    AdNavMenuComponent,
    AdNavNesterDirective,
    AdNavItemDirective
  ]
})
export class AdNavModule { }
