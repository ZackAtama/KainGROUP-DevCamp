import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private BASE_URL: string ='http://localhost:4200/';
  private headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

  constructor(private http: HttpClient) { }

  login(user): Promise<any>{
    
    let url: string = `${this.BASE_URL}/Login`;
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }

  signup(user): Promise<any> {
    let url: string = `${this.BASE_URL}/Signup`;
    return this.http.post(url, user, {headers: this.headers}).toPromise();
  }

}
