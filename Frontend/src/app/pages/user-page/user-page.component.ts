import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
  animations: [ fadeInUpOnEnterAnimation({ translate: '30%', duration: 700 }), fadeOutDownOnLeaveAnimation({ duration: 200, translate: '10%' }) ],
})
export class UserPageComponent implements OnInit {
  users: any;
  userSelected: any = null;
  showDeleteModal: boolean = false;
  showEditModal: boolean = false;
  showCreateModal: boolean = false;
  editForm: FormGroup = this.buildEditForm();
  createForm: FormGroup = this.buildCreateForm();
  formEditChanges: any = {};

  constructor(private _userService: UserService, private fmBuilder: FormBuilder) {
  }

  ngOnInit(): void {

    this._userService.getAllUsers().subscribe(data=> this.users = data)
    this.editForm.valueChanges.subscribe( value => {

      if( value.name !== this.userSelected.name ) this.formEditChanges.name = value.name
      if( value.lastname !== this.userSelected.lastname ) this.formEditChanges.lastname = value.lastname
      if( value.email !== this.userSelected.email ) this.formEditChanges.email = value.email
      if( value.username !== this.userSelected.username ) this.formEditChanges.username = value.username
    })

  }

  selectUser( user: any ) {
    if( this.userSelected ) {
      this.userSelected = null;
      setTimeout(() => this.userSelected = user, 200);
      return;
    }

    this.userSelected = user;
  }

  deleteUser(id:String){
    this._userService.deleteUser(id).subscribe(
      response=>{
        console.log(response);
        this._userService.getAllUsers().subscribe(data=> this.users = data)
        this.showDeleteModal = false;
        this.userSelected = null;

      },
      error=>{
        console.log(<any>error);

      }
    )
  }

  editUser(){
    this._userService.editUser(this.formEditChanges, this.userSelected._id).subscribe(
      data=>{ console.log(data);
        this._userService.getAllUsers().subscribe(data=> this.users = data)
        this.showEditModal = false;
        this.userSelected = null;
      }
    )
  }

  buildEditForm() {
    return this.fmBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
    })
  }

  buildCreateForm(){
    return this.fmBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
    })
  }

  setEditFormValue(){
    this.editForm.patchValue(this.userSelected)
  }

}
