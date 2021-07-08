import { Component, Input, OnInit } from '@angular/core';
import { fadeOutDownOnLeaveAnimation, slideInDownOnEnterAnimation } from 'angular-animations';
import { timer } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    fadeOutDownOnLeaveAnimation({ duration: 500 }),
    slideInDownOnEnterAnimation()
  ]
})
export class AlertComponent implements OnInit {
  show: boolean = false;
  @Input() duration: number = 3000;
  @Input() infinite: boolean = false;
  @Input() width: string = '90%';
  @Input() maxWidth: string = '400px';
  @Input() type: string = 'success';
  @Input() message: string = 'Alert Message';

  constructor() { }

  ngOnInit(): void {
  }

  showAlert( type?: string ) {
    this.type = type || 'success';
    this.show = true;    
    if( !this.infinite ) timer(this.duration).subscribe( () => this.show = false )
  }

}
