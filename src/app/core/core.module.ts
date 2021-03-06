import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification/notification.service';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { NotificationHttpService } from './notification/notification.mock-http.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CoreModule { 
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(config?: any): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        NotificationService,
        AuthService,
        AuthGuardService,
        NotificationHttpService
      ]
    };
  }

}
