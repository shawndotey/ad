import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './views/home/home.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardSideNavComponent } from './dashboard-sidenav/dashboard-sidenav.component';
import { AppRoutingModule } from '../app-routing.module';
import { DashboardDemoSidenavComponent } from './dashboard-demo-sidenav/dashboard-demo-sidenav.component';
import { DemoToggleButtonComponent } from './dashboard-demo-sidenav/demo-toggle-button/demo-toggle-button.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule
  ],
  declarations: [
    HomeComponent,
    DashboardComponent,
    DashboardSideNavComponent,
    DashboardDemoSidenavComponent,
    DemoToggleButtonComponent

  ],
  exports:[
    HomeComponent,
    DashboardComponent
  ]
})
export class DashboardModule { }
