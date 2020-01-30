import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../models/user';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'

})

export class LogInComponent {
    
    pageTitle: string = 'Login';
    imagePath: string = 'assets/images/Dogid.jpg'; 

    user: User = new User();
    
    
    isSubmitted  =  false; 
    
    constructor(private formBuilder: FormBuilder, private authService: AuthService,
        private router: Router) {
    }
    onLogin(): void {
      this.authService.login(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().auth_token);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }
