import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  constructor( private renderer: Renderer2 ) { }

  ngOnInit(){
  }

  showEdit( editAdress: HTMLElement, closeAddress: HTMLElement, action: boolean ) {
    if( action ) {
      this.renderer.setStyle( editAdress, 'display', 'none' )
      this.renderer.setStyle( closeAddress, 'display', 'block' )

    } else {
      this.renderer.setStyle( editAdress, 'display', 'block' )
      this.renderer.setStyle( closeAddress, 'display', 'none' )
    }
    
  }

}
