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
    fadeInUpOnEnterAnimation({ translate: '15%', duration: 700 }),
    fadeOutDownOnLeaveAnimation({ duration: 200, translate: '10%' }),
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation({ duration: 200 })
  ]
})
export class HomePageComponent implements OnInit {
  userLogged: any = {};
  leagues: any;
  results: any;
  leagueSelected: any = null;
  teamsSelected: any = null;
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  showPdfModal: boolean = false;
  showTableModal: boolean = false;
  showDeleteTeamModal: boolean = false;
  showErrorTeamModal: boolean = false;
  showCreateTeamModal: boolean = false;
  showEditTeamModal: boolean = false;
  addMatchDayForm: FormGroup = this.buildMatchDayForm();
  editForm: FormGroup = this.buildEditForm();
  createForm: FormGroup = this.buildCreateForm();
  createTeamForm: FormGroup = this.buildCreateTeamForm();
  editTeamForm: FormGroup = this.buildEditTeamForm();
  formEditChanges: any = {};
  formEditTeamChanges: any ={};
  fileTitle: string = '';
  createTeamData: FormData = new FormData();
  previewImg: string = '';
  matchDays: [] = [];
  selectedMatchDay: any = null;


  constructor( private _leagueService: LeagueService, private fmBuilder: FormBuilder, private userService: UserService ) { }

  ngOnInit():void {
    this.userService.getUserLogged().subscribe( data  => this.userLogged = data );
    this._leagueService.getLeagues().subscribe(data=> this.leagues = data);

    this.editForm.valueChanges.subscribe(value=>{
      if(value.name !== this.leagueSelected.name) this.formEditChanges.name = value.name
    })

    this.editTeamForm.valueChanges.subscribe(value=>{
      if(value.name!== this.teamsSelected.name) this.formEditTeamChanges.name = value.name;
      if(value.coach !== this.teamsSelected.coach) this.formEditTeamChanges.coach = value.coach;
    })
  }

  selectLeague( league: any ) {
    this.leagueSelected = league;
  }

  selectTeam(team: any) {
    this.teamsSelected = team;

  }

  buildMatchDayForm(){
    return this.fmBuilder.group({
      teamOne:    [''],
      teamTwo:    [''],
      idTeamOne   : ['', Validators.required],
      idTeamTwo   : ['', Validators.required],
      goalsTeamOne: ['', Validators.required],
      goalsTeamTwo: ['', Validators.required]
    })
  }

  getResults(id:String){
    this._leagueService.getResults(id).subscribe(data=>{ this.results = data; console.log(data)});
  }

  createLeague(){
      this._leagueService.createLeague(this.createForm.value).subscribe(
        data=>{
          this._leagueService.getLeagues().subscribe(data=> this.leagues = data);
          this.showCreateModal = false;
          this.leagueSelected = null;
        }
      )
  }

  addTeam(){
    this.createTeamData.append( 'name', this.createTeamForm.value.name );
    this.createTeamData.append( 'coach', this.createTeamForm.value.coach );

    this._leagueService.addTeam( this.createTeamData, this.leagueSelected._id).subscribe(
      data => {
        this.showCreateTeamModal = false;
        this.leagueSelected.teams = data?.addedTeam.teams;
        this.createTeamForm.reset();
        this.createTeamData.delete('files');
        this.createTeamData.delete( 'name' );
        this.createTeamData.delete( 'coach' );
        this.previewImg = '';
        this.fileTitle = '';

      },
      error => { this.showErrorTeamModal = true; this.showCreateTeamModal = false;}
      );
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

  editTeam(){
    this._leagueService.editTeam(this.formEditTeamChanges,this.leagueSelected._id,this.teamsSelected._id).subscribe(
      data=>{
        this.leagueSelected.teams = data?.editedTeam.teams;

        this.showEditTeamModal = false;
        this.teamsSelected = null;
      },
      error=>{
        console.log(<any>error);

      }
    )
  }

  deleteLeague(id: String){

    this._leagueService.deleteLeague(id).subscribe(
      response=>{
        this._leagueService.getLeagues().subscribe(data=> this.leagues = data);
        this.showDeleteModal = false;
        this.leagueSelected = null;
      },
      error=>{
        console.log(<any>error);

      }
    )

  }

  deleteTeam(idTeam:String,idLeague:String){

    this._leagueService.deleteTeam(this.teamsSelected,idLeague,idTeam).subscribe(

      data=>{
        this.leagueSelected.teams = data?.deletedTeam.teams;
        this.showDeleteTeamModal = false;
        this.teamsSelected = null;

      },
      error=>{
        console.log(<any>error);

      }

    )

  }

  generatePdf(id:String){

    this._leagueService.generatePdf(id).subscribe(
      data=>{
        this.showPdfModal = false;
      },
      error=>{
        console.log(<any>error)
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

  setEditTeamFormValue(){
    this.editTeamForm.patchValue(this.teamsSelected);

  }

  trackByLeagueId( index: number, item: any ) {
    return item._id;
  }

  fileChange( event: any ) {
    if( event.target.files.length > 0 ) {
      const file = event.target.files[0];
      this.fileTitle = file.name;
      this.createTeamData.append('files', file);

      const reader = new FileReader();
      reader.onload = () => this.previewImg = reader.result as string;
      reader.readAsDataURL( file );
    }
  }

  deleteImg() {
    this.previewImg = '';
    this.createTeamData.delete('files');
    this.fileTitle = '';
  }

  addMatchDay() {
    this._leagueService.addMatchDay( this.selectedMatchDay.selectedMatch._id, this.addMatchDayForm.value ).subscribe()
  }

  setMatchDays() {
    this._leagueService.createMatchDays( this.leagueSelected._id ).subscribe( (data: any) => this.matchDays = data );
  }

  setMatchDay( selectedMatch: any, index: number ) {
    this.selectedMatchDay = { selectedMatch, index: index+1 }
  }

  preventeSelectMatchDay( league: any ) {
    if( this.leagueSelected?._id !== league?._id ) return false;
    return true;
  }

}
