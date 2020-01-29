import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  }   from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component'; 
import { LogInComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LogInComponent,
    HomeComponent,
    NavbarComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule ,
    RouterModule.forRoot([
      {path: 'Signup', component: SignUpComponent },
      {path: 'Login', component: LogInComponent },
      { path: 'admin', component: AdminComponent, canActivate: 
      [AuthGuard]},
      {path: 'Home', component: HomeComponent },
      {path: '', redirectTo: 'Login', pathMatch: 'full', canActivate: 
      [AuthGuard]},
      {path: '**', redirectTo: 'Login', pathMatch: 'full', canActivate: 
      [AuthGuard]}
    ])
  ],
  providers: [AuthService,AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
