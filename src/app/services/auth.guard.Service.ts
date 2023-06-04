import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, retry } from "rxjs";
import { AuthRespons } from "./authService.service";
import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class AuthGuardService implements CanActivate{
  constructor(private authService:AuthRespons,
              private router:Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    let res = this.authService.userCheck();
    console.log(res);
    return res?true:this.router.createUrlTree(['/auth']);
  }

}
