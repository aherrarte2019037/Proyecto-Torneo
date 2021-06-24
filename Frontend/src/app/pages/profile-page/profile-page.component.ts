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

  showEdit( edit: HTMLElement, close: HTMLElement, action: boolean ) {
    if( action ) {
      this.renderer.setStyle( edit, 'display', 'none' )
      this.renderer.setStyle( close, 'display', 'block' )

    } else {
      this.renderer.setStyle( edit, 'display', 'block' )
      this.renderer.setStyle( close, 'display', 'none' )
    }
    
  }

}
