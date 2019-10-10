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
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ApplicationComponent,
    CheckComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    CheckService,
    ApplicationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
