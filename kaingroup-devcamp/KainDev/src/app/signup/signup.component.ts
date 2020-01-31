import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../models/user';

@Component({
    selector: 'app-sign',
    templateUrl: './signup.component.html'

})

export class SignUpComponent {
    pageTitle: string = 'Signup';
    
    imagePath: string = 'assets/images/Dogid.jpg'; 
     
    user: User = new User();

    constructor(private formBuilder: FormBuilder, private authService: AuthService,
      private router: Router) {
  }
 

    onRegister(): void {
      
      this.authService.signup(this.user)
      .then((user) => {
        localStorage.setItem('token', user.json().auth_token);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }