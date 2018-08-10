import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HttpModule
  ],
  declarations: [ HomeComponent],
  exports:[
    
  ]
})
export class HomeModule { }
