import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardSideNavComponent } from './dashboard-sidenav/dashboard-sidenav.component';
import { AppRoutingModule } from '../app-routing.module';
import { DashboardDemoSidenavComponent } from './dashboard-demo-sidenav/dashboard-demo-sidenav.component';
import { ViewsModule } from './views/views.module';
import { DemoToggleButtonComponent } from './dashboard-demo-sidenav/demo-toggle-button/demo-toggle-button.component';
import { DashboardSidenavMenuListService } from './dashboard-sidenav/dashboard-sidenav.menu-list.service';


@NgModule({
  imports: [
    SharedModule,
    AppRoutingModule,
    ViewsModule
  ],
  declarations: [
    DashboardComponent,
    DashboardSideNavComponent,
    DashboardDemoSidenavComponent,
    DemoToggleButtonComponent

  ],
  exports:[
    DashboardComponent
  ],
  providers:[
    DashboardSidenavMenuListService
  ]
})
export class DashboardModule { }
