import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
    
  ],
  declarations: [HomeComponent]
})
export class ViewsModule { }
