import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { NotificationService } from '../../../core/notification/notification.service';

const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    
  ],
  declarations: [AboutComponent],
  exports: [RouterModule],
  providers:[
   // NotificationService
  ]
})
export class AboutModule { }
