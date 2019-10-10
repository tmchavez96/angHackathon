import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { BankApprovalComponent } from './bank-approval/bank-approval.component';


const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'listing',component:BankApprovalComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
