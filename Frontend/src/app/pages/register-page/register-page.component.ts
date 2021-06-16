import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  constructor( private fmBuilder: FormBuilder ) { }

  ngOnInit(): void {
  }

  buildForm(){
    return this.fmBuilder.group({
      'nombre': ['',[Validators.required]],
      'apellido': ['',[Validators.required]],
      'email': ['', [Validators.required, Validators.email]],
      'pass' : ['', Validators.required]
    })
  }

  register(){
  }

}
