
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material/material.module';
import { AdNavModule } from './ad-nav/ad-nav.module';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AdNavModule
    
  ],
  declarations: [
    
  ],
  exports:[
    MaterialModule,
    AdNavModule
  
  ]
})
export class SharedModule { }
