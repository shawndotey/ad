
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { AdNavModule } from './ad-nav/ad-nav.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    AdNavModule,
    FontAwesomeModule
    
  ],
  declarations: [
    
  ],
  exports:[
    CommonModule,
    FormsModule,
    MaterialModule,
    AdNavModule,
    FontAwesomeModule
    
  
  ]
})
export class SharedModule { }
