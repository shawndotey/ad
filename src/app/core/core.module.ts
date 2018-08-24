import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'hammerjs';


@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule

  ],
  declarations: [
    //AdSidenavMenuComponent
  ],
  exports:[
    CommonModule,
    BrowserAnimationsModule
  ]
})
export class CoreModule { }
