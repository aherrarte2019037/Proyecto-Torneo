import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import decode from "jwt-decode";
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = 'http://localhost:3000/api';
  private userLogged = new BehaviorSubject<any>({});
  private profileImg = new BehaviorSubject<any>(`${this.apiUrl}/uploads/profileImg/defaultProfile.gif`);

  constructor( private http: HttpClient ) { }

  login( username: string, password: string, remember: boolean ) {
    return this.http.post<any>( `${this.apiUrl}/login`, { password, username, getToken: true } )
      .pipe( tap( data => this.setToken(data.token, remember) )  )
  }

  logOut() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token')
  }

  setToken( token: string, remember: boolean ) {
    if( token ) {
      if( !remember ) sessionStorage.setItem( 'token', token );
      if( remember ) localStorage.setItem( 'token', token );
    }
  }

  isLogged() {
    let logged;
    logged = localStorage.getItem('token') || false;
    if( !logged ) logged = sessionStorage.getItem('token') || false;
    return logged? true:false;
  }

  getToken() {
    let logged;
    logged = localStorage.getItem('token') || false;
    if( !logged ) logged = sessionStorage.getItem('token') || false;
    return logged;
  }

  setUserLogged() {
    const id = (decode<any>( this.getToken().toString() )).sub;
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })

    this.http.get<any>( `${this.apiUrl}/getUserID/${id}`, { headers } ).subscribe( data => this.userLogged.next(data) );
  }

  getUser() {
    this.setUserLogged();
    return this.userLogged
  }

  getUserLogged() {
    const id = (decode<any>( this.getToken().toString() )).sub;
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })

    return this.http.get<any>( `${this.apiUrl}/getUserID/${id}`, { headers } );
  }

  editUser( user: any, id: string ) {
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })

    return this.http.put<any>( `${this.apiUrl}/editUser/${id}`, user, { headers } )
  }

  uploadImage( id: string, data: FormData ) {
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })

    return this.http.post<any>( `${this.apiUrl}/uploads/profileImg/${id}`, data, { headers } );
  }

  setUserImage( image?: string ) {
    if( !image ) {
      const id = (decode<any>( this.getToken().toString() )).sub;
      const headers = new HttpHeaders({ Authorization: this.getToken().toString() })

      this.http.get<any>( `${this.apiUrl}/getUserID/${id}`, { headers } ).subscribe( data => {
        this.profileImg.next(`${this.apiUrl}/uploads/profileImg/${data.image}`)
      })

    } else {
      this.profileImg.next(`${this.apiUrl}/uploads/profileImg/${image}?q=${Math.random()}`)
    }
  }

  getUserImage() {
    return this.profileImg
  }

  deletedProfileImg( id: string ) {
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })

    return this.http.delete<any>( `${this.apiUrl}/uploads/profileImg/${id}`, { headers } )
  }

  register(user: User): Observable<any>{

    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type','application/json')

    return this.http.post(this.apiUrl+'/registerUser',params,{ headers});

  }

}
