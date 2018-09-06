import { HomeModule } from './home/home.module';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { AppRoutingModule } from '../../app-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AppRoutingModule,
    HomeModule
  ],
  declarations: [],
  exports:[
  ]
})
export class ViewsModule { }
