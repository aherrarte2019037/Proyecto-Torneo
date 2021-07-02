import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/api'

  constructor( private http: HttpClient ) { }

  login( username: string, password: string) {
    return this.http.post<any>( `${this.apiUrl}/login`, { password, username, getToken: true } )
      .pipe( tap( data => this.setToken(data.token) )  )
  }

  logOut() {
    localStorage.removeItem('token');
  }

  setToken( token: string ) {
    localStorage.setItem('token', token)
  }

  isLogged() {
    return localStorage.getItem('token')? true:false;
  }

}