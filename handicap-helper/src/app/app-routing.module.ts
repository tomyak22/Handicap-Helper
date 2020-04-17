import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoundListComponent } from './round-list/round-list.component';
import { RoundCreateComponent } from './round-create/round-create.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { AuthGuard } from './auth/auth.guard';

/**
 * MAY WANT TO RETHINK WHAT GETS LOADED FIRST
 */
const routes: Routes = [
  { path: '', component: RoundListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: RoundCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:roundId', component: RoundCreateComponent, canActivate: [AuthGuard] },
  { path: 'login', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
