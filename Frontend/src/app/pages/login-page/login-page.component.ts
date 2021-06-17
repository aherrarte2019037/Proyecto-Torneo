import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup = this.buildForm();

  constructor( private fmBuilder: FormBuilder, private title: Title ) { }

  ngOnInit() {
    this.title.setTitle( 'Iniciar Sesión' )
  }

  buildForm() {
    return this.fmBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'pass' : ['', Validators.required]
    })
  }

  login() {

  }

}
