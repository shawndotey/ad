import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { AuthGuardService } from '../auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuardService]
  },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: './home', pathMatch: 'full' },

];

const RouterModuleRoutes = RouterModule.forRoot(routes)

@NgModule({
  imports: [RouterModuleRoutes],
  exports: [RouterModule]
})
export class AppRoutingModule { }
