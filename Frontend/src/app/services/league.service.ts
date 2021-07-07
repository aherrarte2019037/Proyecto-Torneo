import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


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

    return this.http.get( `${this.apiUrl}/getLeaguesIdCreator`, { headers })

  }

  createLeague(league: any): Observable<any>{

    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })
    return this.http.post( `${this.apiUrl}/createLeague`,league, { headers })

  }

  editLeague(league: any, id: String): Observable<any>{
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })

    return this.http.put( `${this.apiUrl}/editLeague/${id}`,league, { headers });
  }

  deleteLeague(id:String): Observable<any>{

    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })
    return this.http.delete( `${this.apiUrl}/deleteLeague/${id}`, { headers });

  }

  addTeam( data: FormData, id:String ): Observable<any> {

    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })
    return this.http.put( `${this.apiUrl}/addTeam/${id}`, data, { headers });

  }

  editTeam(team:any, idLeague:string,idTeam:string): Observable<any>{

    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })
    return this.http.put( `${this.apiUrl}/editTeam/${idLeague}/${idTeam}`,team, { headers });

  }

  deleteTeam(x:any,idLeague:String,idTeam:String):Observable<any> {

    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })
    return this.http.put( `${this.apiUrl}/deleteTeamOfLeague/${idLeague}/${idTeam}`,x,{ headers });

  }

  createMatchDays( league: string ) {
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })
    
    return this.http.post( `${this.apiUrl}/createMatchDay/${league}`, {}, { headers });
  }

  addMatchDay( matchDay: string, teams: any ) {
    const headers = new HttpHeaders({ Authorization: this.getToken().toString() })
    
    return this.http.post( `${this.apiUrl}/assignTeams/${matchDay}`, teams, { headers });
  }

}
