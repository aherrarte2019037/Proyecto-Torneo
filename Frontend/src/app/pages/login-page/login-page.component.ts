import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { fadeInDownOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  animations: [ fadeInDownOnEnterAnimation({ duration: 500 }), fadeOutOnLeaveAnimation({ duration: 500 }) ]
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup = this.buildForm();
  showModal: boolean = false;
  modalMessage: string = '';

  constructor( private fmBuilder: FormBuilder, private router: Router, private title: Title, private userService: UserService ) { }

  ngOnInit() {
    this.title.setTitle( 'Iniciar Sesión' );
  }

  buildForm() {
    return this.fmBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    })
  }

  getFormError( input: string ) {
    const error = this.loginForm.get(input)?.errors;
    const invalid = this.loginForm.get(input)?.invalid;
   
    if( invalid && this.loginForm.get(input)?.dirty || invalid && this.loginForm.get(input)?.touched ) {
      if( 'required' in error! ) return 'Campo Requerido';
      if( 'minlength' in error! ) return `Mínimo ${error.minlength.requiredLength} caracteres`;
      if( 'maxlength' in error! ) return `Máximo ${error.maxlength.requiredLength}`;
      if( 'email' in error! ) return 'Correo Electrónico Inválido';
      if( 'pattern' in error! ) return 'Contraseña Inválida';
    }

    return null;
  }

  login() {
    if( this.loginForm.invalid ) return;

    const { username, password } = this.loginForm.value;

    this.userService.login( username, password ).subscribe(
      data => data.token? this.router.navigateByUrl('/dashboard'):null,
      error => {
        this.showModal = true;
        this.modalMessage = error.error.mensaje || 'Error inesperado';
      }
    )
  }

  goToRegister() {
    this.router.navigateByUrl('/register')
    this.showModal = false;
  }

}
