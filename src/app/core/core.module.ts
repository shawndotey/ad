import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppLayoutModule } from '../layout/layout.module';
import {SharedModule} from '../shared/shared.module';
import 'hammerjs';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    AppLayoutModule

  ],
  declarations: [
    //AdSidenavMenuComponent
  ],
  exports:[
    CommonModule,
    BrowserAnimationsModule,
    AppLayoutModule
  ]
})
export class CoreModule { }
