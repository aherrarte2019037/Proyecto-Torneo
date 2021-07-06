import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { LeagueService } from 'src/app/services/league.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [ fadeInUpOnEnterAnimation({ translate: '30%', duration: 700 }), fadeOutDownOnLeaveAnimation({ duration: 200, translate: '10%' }) ],
})
export class HomePageComponent implements OnInit {
  userLogged: any = {};
  leagues: any;
  leagueSelected: any = null;
  showCreateModal: boolean = false;
  createForm: FormGroup = this.buildCreateForm();

  constructor( private _leagueService: LeagueService, private fmBuilder: FormBuilder, private userService: UserService ) { }

  ngOnInit():void {
    this.userService.getUserLogged().subscribe( data  => this.userLogged = data );
    this._leagueService.getLeagues().subscribe(data=> this.leagues = data);
  }

  selectLeague( league: any ) {
    if( this.leagueSelected ) {
      this.leagueSelected = null;
      setTimeout(() => this.leagueSelected = league, 200);
      return;
    }

    this.leagueSelected = league;
  }

  buildCreateForm(){
    return this.fmBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

}
