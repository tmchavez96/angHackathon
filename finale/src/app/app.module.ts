import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ApplicationComponent } from './application/application.component';
import { CheckComponent } from './check/check.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckService } from './shared/check.service';
import { ApplicationService } from './shared/application.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BankApprovalComponent } from './bank-approval/bank-approval.component';
import { BankApprovalService } from './shared/bank-approval.service';
import { BankLoginComponent } from './bank-login/bank-login.component';
import { AuthInterceptor } from './shared/auth.interceptor';
import { AuthService } from './shared/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ApplicationComponent,
    CheckComponent,
    BankApprovalComponent,
    BankLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    CheckService,
    ApplicationService,
    BankApprovalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
