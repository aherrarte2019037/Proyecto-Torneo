import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  private apiUrl: string = 'http://localhost:3000/api';

  constructor( private http: HttpClient ) { }

  setToken( token: string, remember: boolean ) {
    if( token ) {
      if( !remember ) sessionStorage.setItem( 'token', token );
      if( remember ) localStorage.setItem( 'token', token );
    }
  }

  getToken() {
    let logged;
    logged = localStorage.getItem('token') || false;
    if( !logged ) logged = sessionStorage.getItem('token') || false;
    return logged;
  }

  getLeagues(){
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })

    return this.http.get( `${this.apiUrl}/getRegisteredUsers`, { headers })

  }

}
