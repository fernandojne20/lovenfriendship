import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  { path: 'auth', component: AuthenticationComponent },
  { path: 'lovenfriendship', component: HomeComponent },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', component: AuthenticationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
