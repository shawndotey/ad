import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './dashboard/about/about.component';
import { HomeComponent } from './dashboard/home/home.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    //canActivate: [AuthGuardService],
    children:[
      {
        path: 'about',
        component: AboutComponent,
        //canActivate: [AuthGuardService]
      },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

const RouterModuleRoutes = RouterModule.forRoot(routes)

@NgModule({
  imports: [RouterModuleRoutes],
  exports: [RouterModule]
})
export class AppRoutingModule { }
