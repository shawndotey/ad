
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppDashboardSideNavComponent } from './dashboard-sidenav/dashboard-sidenav.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AppDashboardSideNavComponent
   
  ],
  exports:[
    AppDashboardSideNavComponent
  ]
})
export class AppLayoutModule { }
