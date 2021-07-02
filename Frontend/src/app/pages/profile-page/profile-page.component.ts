import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  profileForm: FormGroup = this.buildForm();
  formActivated: boolean = false;
  fileData: FormData = new FormData();
  fileTitle: string = '';
  previewImg: string = '';

  constructor( private renderer: Renderer2, private loadingBarService: LoadingBarService, private formBuilder: FormBuilder ) { }

  ngOnInit(){
  }

  buildForm() {
    const form = this.formBuilder.group({
      username  : ['a', Validators.required],
      email     : ['a', [Validators.required, Validators.email]],
      firstname : ['a', Validators.required],
      lastname  : ['a', Validators.required],
      profileImg: ['']
    });

    form.disable();

    return form;
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

  editProfile() {
    this.alert.showAlert();
    this.deactivateForm()
  }

  fileChange( event: any ) {
    if( event.target.files.length > 0 ) {
      const file = event.target.files[0];
      this.fileTitle = file.name;
      this.fileData.append('profileImg', file);

      const reader = new FileReader();
      reader.onload = () => this.previewImg = reader.result as string;
      reader.readAsDataURL( file );
    }
  }

  activateForm() {
    this.profileForm.enable();
    this.formActivated = true;
  }

  deactivateForm() {
    this.deleteImg();
    this.formActivated = false;
    this.profileForm.disable()
  }

  deleteImg() {
    this.previewImg = '';
    this.fileData.delete('profileImg');
    this.fileTitle = '';
  }
  
}
