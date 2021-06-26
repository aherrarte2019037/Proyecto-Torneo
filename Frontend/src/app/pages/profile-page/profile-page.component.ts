import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AlertComponent } from 'src/app/components/alert/alert.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  @ViewChild(AlertComponent) alert!: AlertComponent;
  loadingBar = this.loadingBarService.useRef('dashboardBar');

  constructor( private renderer: Renderer2, private loadingBarService: LoadingBarService ) { }

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
