import { Component, OnInit } from '@angular/core';
import { fadeInUpOnEnterAnimation, fadeOutDownOnLeaveAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
  animations: [ fadeInUpOnEnterAnimation({ translate: '30%', duration: 700 }), fadeOutDownOnLeaveAnimation({ duration: 200, translate: '10%' }) ]
})
export class UserPageComponent implements OnInit {
  users: [] = [];
  userSelected: any = null;
  showDeleteModal: boolean = false;

  constructor() { }

  ngOnInit(): void {  

  }

  selectUser( user: any ) {
    if( this.userSelected ) {
      this.userSelected = null;
      setTimeout(() => this.userSelected = user, 200);
      return;
    }

    this.userSelected = user;
  }

}
