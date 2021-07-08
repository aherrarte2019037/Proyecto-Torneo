import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router, private userService: UserService ) { }

  canActivate(): boolean  {
    
    if( this.userService.isLogged() ) return true;

    this.router.navigateByUrl('/login');
    return false;

  }
  
}
