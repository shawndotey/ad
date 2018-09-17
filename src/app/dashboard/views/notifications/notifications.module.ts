import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { SharedModule } from '../../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { AdGeneralNotificationCardComponent } from './ad-general-notification-card/ad-general-notification-card.component';
import { AdSummaryCardComponent } from './ad-summary-card/ad-summary-card.component';

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
  declarations: [NotificationsComponent, AdGeneralNotificationCardComponent, AdSummaryCardComponent],
  exports: [RouterModule],
  providers:[
  ]
})
export class NotificationsModule { }
