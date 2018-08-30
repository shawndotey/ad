import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout'
import { LoginComponent } from './login/login.component';


import { DashboardModule } from './dashboard/dashboard.module';
import { AppRoutingModule } from './app-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginModule } from './login/login.module';



@NgModule({
  declarations: [
    AppComponent     
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    LoginModule,
    DashboardModule,
    AppRoutingModule
  ],
  exports:[

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
