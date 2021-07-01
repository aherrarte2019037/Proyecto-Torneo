import { Component, OnInit } from '@angular/core';
import { fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'soccer-spinner',
  templateUrl: './soccer-spinner.component.html',
  styleUrls: ['./soccer-spinner.component.css'],
  animations: [ fadeOutOnLeaveAnimation() ]
})
export class SoccerSpinerComponent implements OnInit {
  show: boolean = true;

  constructor() { }

  ngOnInit(){
    setTimeout(() => this.show = false, 500);
  }

}
