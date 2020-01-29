import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User  } from '../user';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'

})
export class LogInComponent implements OnInit{
    pageTitle: string = 'Login';
    imagePath: string = 'assets/images/Dogid.jpg'; 

    loginForm: FormGroup;
    isSubmitted  =  false; 
    
    constructor(private formBuilder: FormBuilder, private authService: AuthService,
        private router: Router) {
    }
    
    ngOnInit(){
        this.loginForm = this.formBuilder.group({
            id: [], 
            email: ['',  Validators.required],
            password: ['', Validators.required]
        });
    }


    get formControls() { 
        return this.loginForm.controls; 
    }

    login(){
        console.log(this.loginForm.value);
        this.isSubmitted = true;
        if(this.loginForm.invalid){
          return;
        }
        this.authService.login(this.loginForm.value);
        this.router.navigateByUrl('/admin');
      }
      


}