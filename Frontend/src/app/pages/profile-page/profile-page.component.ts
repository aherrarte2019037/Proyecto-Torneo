import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { UserService } from 'src/app/services/user.service';

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
  userLogged: any;
  formChanges: any = {};
  imgUrl: string = '';

  constructor( private renderer: Renderer2, private userService: UserService, private loadingBarService: LoadingBarService, private formBuilder: FormBuilder ) { }

  ngOnInit(){
    this.userService.getUser().subscribe( data => { this.userLogged = data; this.setFormValues() });
    this.userService.getUserImage().subscribe( data => this.imgUrl = data );
  }

  setFormValues() {
    this.profileForm.patchValue( this.userLogged );
    this.profileForm.valueChanges.subscribe( value => {
      if( 
        value.username === this.userLogged.username
        && value.email === this.userLogged.email 
        && value.name === this.userLogged.name
        && value.lastname === this.userLogged.lastname ) return this.formActivated = false;

      if( value.name !== this.userLogged.name ) this.formChanges.name = value.name
      if( value.lastname !== this.userLogged.lastname ) this.formChanges.lastname = value.lastname
      if( value.email !== this.userLogged.email ) this.formChanges.email = value.email
      if( value.username !== this.userLogged.username ) this.formChanges.username = value.username
      return this.formActivated = true;  
    })
  }

  buildForm() {
    const form = this.formBuilder.group({
      username  : ['', Validators.required],
      email     : ['', [Validators.required, Validators.email]],
      name      : ['', Validators.required],
      lastname  : ['', Validators.required],
      profileImg: ['']
    });

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
    if( this.fileTitle.length > 0 ) {
      this.userService.uploadImage( this.userLogged._id, this.fileData ).subscribe( data => {
        if( data?.filename ) this.imgUrl = `http://localhost:3000/api/uploads/profileImg/${data.filename}?q=${Math.random()}`
        this.userService.setUserImage( data?.filename );
      });
    }

    this.userService.editUser( this.formChanges, this.userLogged._id ).subscribe(
      () => {
        this.alert.duration = 2000;
        this.alert.showAlert();
        this.userService.getUser().subscribe()
        this.formChanges = {};
      },

      error => {
        this.alert.message = error.error.message || ''; this.alert.showAlert( 'danger' ) }
    )
    this.deactivateForm()
  }

  fileChange( event: any ) {
    this.formActivated = true;
    if( event.target.files.length > 0 ) {
      const file = event.target.files[0];
      this.fileTitle = file.name;
      this.fileData.append('files', file);

      const reader = new FileReader();
      reader.onload = () => this.previewImg = reader.result as string;
      reader.readAsDataURL( file );
    }
  }

  deactivateForm() {
    this.deleteImg();
    this.formActivated = false;
  }

  deleteImg() {
    this.previewImg = '';
    this.fileData.delete('files');
    this.fileTitle = '';
  }

  deleteProfileImg() {
    this.userService.deletedProfileImg( this.userLogged._id ).subscribe( data => this.userService.setUserImage() )
  }
  
}
