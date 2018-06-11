import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ADDashboardComponent } from './ad-dashboard/ad-dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatTreeModule } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { AdDashboardSideNavComponent } from './ad-dashboard-side-nav/ad-dashboard-side-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    ADDashboardComponent,
    HomeComponent,
    AdDashboardSideNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
