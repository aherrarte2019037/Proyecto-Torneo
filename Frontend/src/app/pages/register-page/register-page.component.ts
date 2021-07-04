import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  providers: [UserService]
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup = this.buildForm();

  public user: User;

  constructor( private fmBuilder: FormBuilder, private title: Title, private _userService: UserService, private _router: Router ) {

    this.user = new User("","","","","","","","");

  }

  ngOnInit() {
    this.title.setTitle( 'Crear Cuenta' )
  }

  buildForm(){
    return this.fmBuilder.group({
      'firstname': ['',[Validators.required]],
      'lastname' : ['',[Validators.required]],
      'username' : ['',[Validators.required]],
      'email'    : ['', [Validators.required, Validators.email]],
      'password'     : ['', Validators.required]
    })
  }

  register(){
    this._userService.register(this.user).subscribe(
      response =>{
        console.log(response);

        this._router.navigate(['/dashboard'])

      },
      error=>{
        console.log(<any>error);

      }
    )
  }

}
