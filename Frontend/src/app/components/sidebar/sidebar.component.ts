import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: any;
  imgUrl: string = '';

  constructor( private router: Router, private userService: UserService ) { }

  ngOnInit() {
    this.userService.getUser().subscribe( data => this.user = data );
    this.userService.setUserImage();
    this.userService.getUserImage().subscribe( data => this.imgUrl = data )
  }

  logOut() {
    this.router.navigateByUrl('/login')
    this.userService.logOut();
  }

}