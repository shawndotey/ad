import { NotificationService } from './core/notification/notification.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

import { DashboardModule } from './dashboard/dashboard.module';
import { AppRoutingModule } from './app-routing.module';
import { LoginModule } from './login/login.module';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule.forRoot({}),
    BrowserAnimationsModule,
    LayoutModule,
    LoginModule,
    DashboardModule,
    AppRoutingModule
  ],
  exports: [],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
