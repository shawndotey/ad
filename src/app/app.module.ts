import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppLayoutModule } from './layout/layout.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardModule } from './dashboard/dashboard.module';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent  
  ],
  imports: [
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
    CoreModule,
    LayoutModule,
    DashboardModule,
    AppLayoutModule,


    // FormsModule,
    // HttpModule,
    // NgGridModule
   
  ],
  exports:[
    SharedModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
