import { Component, Input, OnInit } from '@angular/core';
import { fadeInDownOnEnterAnimation, fadeOutDownOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    fadeInDownOnEnterAnimation(),
    fadeOutDownOnLeaveAnimation()
  ]
})
export class AlertComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() duration: number = 3500;
  @Input() infinite: boolean = false;
  @Input() width: string = '90%';
  @Input() maxWidth: string = '400px';
  @Input() type: string = 'success';

  constructor() { }

  ngOnInit(): void {
    if( !this.infinite ) setTimeout(() => this.show = false, this.duration);
  }

}
