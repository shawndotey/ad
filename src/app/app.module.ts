import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HomeModule } from './home/home.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppLayoutModule } from './layout/layout.module';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AboutComponent  
  ],
  imports: [
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule,
    CoreModule,
    LayoutModule,
    HomeModule,
    
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
