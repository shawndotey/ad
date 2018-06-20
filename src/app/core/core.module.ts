import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AdDashboardModule } from '../layout/ad-dashboard.module';
import {SharedModule} from 'src/app/shared/shared.module';
import 'hammerjs';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AdDashboardModule

  ],
  declarations: [
    //AdSidenavMenuComponent
  ],
  exports:[
    CommonModule,
    BrowserAnimationsModule,
    AdDashboardModule
  ]
})
export class CoreModule { }
