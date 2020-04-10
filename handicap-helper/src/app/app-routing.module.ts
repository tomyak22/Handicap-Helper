import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoundListComponent } from './round-list/round-list.component';
import { RoundCreateComponent } from './round-create/round-create.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';


const routes: Routes = [
  { path: '', component: RoundListComponent },
  { path: 'create', component: RoundCreateComponent },
  { path: 'edit/:roundId', component: RoundCreateComponent },
  { path: 'login', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
