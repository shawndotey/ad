
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { AdNavModule } from './ad-nav/ad-nav.module';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AdNavModule,
    AppRoutingModule
    
  ],
  declarations: [
    
  ],
  exports:[
    MaterialModule,
    AdNavModule,
    AppRoutingModule
  ]
})
export class SharedModule { }
