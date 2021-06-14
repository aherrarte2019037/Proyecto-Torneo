import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup = this.buildForm();

  constructor( private fmBuilder: FormBuilder ) { }

  ngOnInit() {
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
