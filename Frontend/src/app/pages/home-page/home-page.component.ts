import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { fadeInOnEnterAnimation, fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { LeagueService } from 'src/app/services/league.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [
    fadeInUpOnEnterAnimation({ translate: '30%', duration: 700 }),
    fadeOutDownOnLeaveAnimation({ duration: 200, translate: '10%' }),
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class HomePageComponent implements OnInit {
  userLogged: any = {};
  leagues: any;
  leagueSelected: any = null;
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showDeleteTeamModal: boolean = false;
  showErrorTeamModal: boolean = false;
  showCreateTeamModal: boolean = false;
  showEditTeamModal: boolean = false;
  editForm: FormGroup = this.buildEditForm();
  createForm: FormGroup = this.buildCreateForm();
  createTeamForm: FormGroup = this.buildCreateTeamForm();
  editTeamForm: FormGroup = this.buildEditTeamForm();
  formEditChanges: any = {};

  constructor( private _leagueService: LeagueService, private fmBuilder: FormBuilder, private userService: UserService ) { }

  ngOnInit():void {
    this.userService.getUserLogged().subscribe( data  => this.userLogged = data );
    this._leagueService.getLeagues().subscribe(data=> this.leagues = data);

    this.editForm.valueChanges.subscribe(value=>{
      if(value.name !== this.leagueSelected.name) this.formEditChanges.name = value.name
    })
  }

  selectLeague( league: any ) {
    if( this.leagueSelected && this.leagueSelected !== league ) {
      this.leagueSelected = null;
      setTimeout(() => this.leagueSelected = league, 200);
      return;
    }

    this.leagueSelected = league;
  }

  createLeague(){
      this._leagueService.createLeague(this.createForm.value).subscribe(
        data=>{
          this._leagueService.getLeagues().subscribe(data=> this.leagues = data);
          this.showCreateModal = false;
        }
      )
  }

  addTeam(){
    this._leagueService.addTeam(this.createTeamForm.value,this.leagueSelected._id).subscribe(
      data=>{
        this._leagueService.getLeagues().subscribe(data=> this.leagues = data);
        this.showCreateTeamModal = false;
      },
      error=>{
        console.log(<any>error);
        this.showCreateTeamModal = false;
        this.showErrorTeamModal = true;

      }
    )
  }

  editLeague(){
    this._leagueService.editLeague(this.formEditChanges,this.leagueSelected._id).subscribe(
      data=> {
        this._leagueService.getLeagues().subscribe(data=> this.leagues = data);
        this.showEditModal = false;
        this.leagueSelected = null;
      }
    )
  }

  deleteLeague(id: String){

    this._leagueService.deleteLeague(id).subscribe(
      response=>{
        console.log(response);
        this._leagueService.getLeagues().subscribe(data=> this.leagues = data);
        this.showDeleteModal = false;
        this.leagueSelected = null;
      },
      error=>{
        console.log(<any>error);

      }
    )

  }

  buildCreateForm(){
    return this.fmBuilder.group({
      name: ['', [Validators.required]]
    })
  }

  buildEditForm(){

    return this.fmBuilder.group({
      name: ['', [Validators.required]]
    })

  }

  buildCreateTeamForm(){
    return this.fmBuilder.group({
      name: ['', [Validators.required]],
      coach: ['', [Validators.required]]
    })
  }

  buildEditTeamForm(){
    return this.fmBuilder.group({
      name: ['', [Validators.required]],
      coach: ['', [Validators.required]]
    })
  }

  setEditFormValue(){
    this.editForm.patchValue(this.leagueSelected);
  }

}
