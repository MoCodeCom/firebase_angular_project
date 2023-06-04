import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Subject,from, catchError, tap, throwError, BehaviorSubject, subscribeOn, Observable, map } from "rxjs";
import { UserModule } from "../modules/user.modules";
import { Router } from "@angular/router";
import { UserRole } from "../modules/userRole";



interface responsePayload{
    idToken:string,
    email:string,
    refreshToken:string,
    expiresIn:string,
    localId:string,
    register?:boolean
}



@Injectable({providedIn:'root'})
export class AuthRespons{

   userSubject = new Subject<UserModule>();

   //to add role to code form firebase database
   roles$:Observable<UserRole>;

   constructor(private http:HttpClient,
               private authFireService:AngularFireAuth,
               private router:Router){

                this.roles$ = this.authFireService.idTokenResult
                .pipe(
                  map(obj =>
                    <any>obj?.claims?{admin:true}:
                      {admin:false}
                  )
                );

                console.log(this.userCheck());
               }

   authResponse(email:string, password:string){
    const createuser =
    this.authFireService.createUserWithEmailAndPassword(email, password);

    /*.then(data =>{
      const email_data = data.user.email;
      const refreshToken_data = data.user.refreshToken;
      const id_data = data.user.providerId;
      //new UserModule(email_data, refreshToken_data, id_data);

    })*/

    const obs = from(createuser);
    obs.subscribe((data)=>{
      const email_data = data.user.email;
      const refreshToken_data = data.user.refreshToken;
      const id_data = data.user.uid;
      const user = new UserModule(email_data, refreshToken_data, id_data);
      this.userSubject.next(user);
      },err =>{
        this.handleError(err);
      });
    return obs;


    /*
    .catch(err =>{
      let errorMsg:any = 'An error unknown!'
      switch(err.error.message){
        case 'EMAIL_EXISTS':
          errorMsg = 'This email exists aleady';
      }
      return throwError(errorMsg.error.message);
    });
    */

    /*
    return this.http.post
    <responsePayload>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBCEje-K0rj5gJJBMEwyEwXH5jn-V_JfVw'
    ,{
        email: email,
        password: password,
        returnSecureToken: true
    });*/
  }

  login(email:string, password:string){
    const loginuser = this.authFireService.signInWithEmailAndPassword(email, password);
    //to convert promis [loginuser] to observable [ops] with [observable = form(promis)]


    const ops = from(loginuser);
    ops.subscribe((data)=>{
          const email_data = data.user.email;
          const refreshToken_data = data.user.refreshToken;
          const id_data = data.user.uid;
          const user = new UserModule(email_data, refreshToken_data, id_data);
          this.userSubject.next(user);
          localStorage.setItem('userData', JSON.stringify(user));
    },err =>{
      this.handleError(err);
    });


    return ops;

    /*
    .then(data =>{
      const email_data = data.user.email;
      const refreshToken_data = data.user.refreshToken;
      const id_data = data.user.providerId;
      //new UserModule(email_data, refreshToken_data, id_data);
      console.log(data);
    });
    */
    //return this.authFireService.signInWithEmailAndPassword(email, password);

    /*
    return this.http.post(,

      );*/
  }

  logout(){
    this.authFireService.signOut();
    this.userSubject.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('userData');
    window.location.reload();
  }

  private handleError(errRes:HttpErrorResponse){
    let errMsg = 'default error!';
    if(!errRes.error || !errRes.error.error){
      return throwError(errMsg);
    }
    return throwError(errRes.error.message);
  }

  autoLogin(){
    const userData:UserModule= JSON.parse(localStorage.getItem('userData'));
    this.authFireService.idTokenResult
    if(!userData){
      return false;
    }
    const loadedUser = new UserModule(userData.email, userData.id, userData.refreshToken);
    this.userSubject.next(loadedUser);
    return true;
  }


  autoLogout(){
    localStorage.removeItem('userData');
    this.logout();
  }


  userCheck():boolean{
    const authExist = JSON.parse(localStorage.getItem('userData'));
    return authExist?true:false;
  }
}
