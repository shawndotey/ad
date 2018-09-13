import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { SharedModule } from '../../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NotificationsComponent
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [NotificationsComponent],
  exports: [RouterModule],
  providers:[
  ]
})
export class NotificationsModule { }
