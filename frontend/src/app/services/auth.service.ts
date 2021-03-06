import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl : string = environment.api_url;
 
  constructor(
    private http: HttpClient, 
    private router: Router,
    ) { }

  register(user: User):Observable<any> {
    return this.http.post<any>(this.baseUrl + "/user/register", user)
  }

  login(user: User):Observable<any> {
    return this.http.post<any>(this.baseUrl + "/user/login", user)
    .pipe(
      map(
        (resp: any) => {
          console.log(resp);        
          localStorage.setItem('TOKEN_APPLI', resp.token);
          localStorage.setItem('USER_ID', resp.userId);
          localStorage.setItem('USER_NAME', resp.userName);
          console.log('Token Save');
          console.log(resp.userId);
          console.log(resp.userName);
          return resp;
        }
      )
    )
  }

  getIdByToken(){
    const token = localStorage.getItem("TOKEN_APPLI")
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    console.log(decodedToken)
    const id = decodedToken.userId;
    return id;
  }

//   This library provides an HttpInterceptor 
//   which automatically attaches a JWToken to HttpClient requests.
//   You will use a regular HTTP request to authenticate your users and 
//   then save their JWTs in local storage or in a cookie if successful.
  
  logout() {
    localStorage.removeItem('TOKEN_APPLI');
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('USER_NAME');
    this.router.navigate(["/"]);
  }
}
