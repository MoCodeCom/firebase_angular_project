import { Component, OnInit } from '@angular/core';
import { AuthRespons } from './services/authService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authservice:AuthRespons){}
  ngOnInit(): void {
    this.defineUser();
  }
  title = 'firebaseApp';
  userName:string;
  logBool:boolean;
  logString:string='';


  logout(){
    //this.logBool = false;
    this.authservice.logout();
    this.userName = 'NoUser'
    this.ngOnInit();
  }

  login(){
     const check = this.authservice.autoLogin();
     if(check){
      const data = JSON.parse(localStorage.getItem('userData'));
      if(data){
        this.userName = data.email;
        this.logBool=false;
        this.ngOnInit();
      }
     }else{
      alert('please login of sign in');
     }
  }

  loginlogout(){
    const data = JSON.parse(localStorage.getItem('userData'));
    if(data)this.userName = data.email;

  }


  defineUser(){
    const data = JSON.parse(localStorage.getItem('userData'));
    if(data != null){
      this.logBool=true;
      this.userName = data.email;
    }else{
      this.logBool=false;
      this.userName = 'NoUser';

    }

  }
}
