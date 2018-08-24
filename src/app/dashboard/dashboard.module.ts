import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './views/home/home.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardSideNavComponent } from './dashboard-sidenav/dashboard-sidenav.component';
import { AppRoutingModule } from '../core/app-routing.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
    DashboardSideNavComponent

  ],
  exports:[
    HomeComponent,
    DashboardComponent
  ]
})
export class DashboardModule { }
