import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './core/auth/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './dashboard/views/home/home.component';
const routes: Routes = [
  //{ path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivateChild: [AuthGuardService],
    children:[
      
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'about',
       // component: AboutComponent,
        loadChildren: './dashboard/views/about/about.module#AboutModule'
        //canActivate: [AuthGuardService]
      }
    
    ],
    
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
];

const RouterModuleRoutes = RouterModule.forRoot(routes)

@NgModule({
  imports: [RouterModuleRoutes],
  exports: [RouterModule]
})
export class AppRoutingModule { }
