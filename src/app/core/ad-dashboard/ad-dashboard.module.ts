
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdDashboardSideNavComponent } from './ad-dashboard-sidenav/ad-dashboard-sidenav.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    AdDashboardSideNavComponent
   
  ],
  exports:[
    AdDashboardSideNavComponent
  ]
})
export class AdDashboardModule { }
