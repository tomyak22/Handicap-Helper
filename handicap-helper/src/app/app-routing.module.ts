import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoundListComponent } from './round-list/round-list.component';
import { RoundCreateComponent } from './round-create/round-create.component';


const routes: Routes = [
  { path: '', component: RoundListComponent },
  { path: 'create', component: RoundCreateComponent },
  { path: 'edit/:roundId', component: RoundCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
