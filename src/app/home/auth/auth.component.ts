import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as firebaseui from 'firebaseui';
//import firebase from 'firebase/app';
import 'firebase/auth';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { AuthRespons } from 'src/app/services/authService.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode:boolean = true;
  isLoading:boolean = false;
  errorHtml:string= null;

  @Output()log = new EventEmitter<any>();

   //ui:firebaseui.auth.AuthUI;

  constructor(
    //private router:Router,
    //private afAuth:AngularFireAuth
    private authService:AuthRespons,
    private router:Router
    ){}


  ngOnInit(): void {

  }

  onLogin(){
    this.isLoginMode = !this.isLoginMode;

  }

  onLogout(){
    this.log.emit(this.isLoading);

  }

  onSubmit(form: NgForm){
    let obser:Observable<any>;
    const emailForm = form.value.email;
    const passwordFrom = form.value.password;
    this.isLoading = true;

    if(!this.isLoginMode){
      obser = this.authService.login(emailForm, passwordFrom);
    }else{
      obser = this.authService.authResponse(emailForm, passwordFrom);
      this.isLoading = false;
    }
      obser.subscribe(
      data =>{

      //this.router.navigateByUrl('/main');
      window.location.reload();
    },
    err =>{
      this.errorHtml = err.message;

    });

    form.reset();
    this.isLoading = false;
  }



  onLoginSuccessful():void{
    this.router.navigateByUrl("/main");
  }

  ngOnDestroy(): void {
    //this.ui.delete();
  }

}
