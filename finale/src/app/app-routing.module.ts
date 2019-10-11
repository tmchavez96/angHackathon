import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CheckComponent } from './check/check.component';
import { ApplicationComponent } from './application/application.component';
import { BankApprovalComponent } from './bank-approval/bank-approval.component';
import { BankLoginComponent } from './bank-login/bank-login.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'application', component: ApplicationComponent },
  { path: 'check', component: CheckComponent },
  { path: 'banker', component: BankApprovalComponent },
  { path: 'bankerlogin', component: BankLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
