import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { AuthComponent } from './home/auth/auth.component';
import { ProductsComponent } from './home/products/products.component';
import { MainComponent } from './home/main/main.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AuthInterceptorService } from './services/interceptor.service'
import { interceptorLogin } from './services/interceptorLogin.service';

import { AngularFireModule } from '@angular/fire/compat';
//import { AngularFirestoreModule } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireStorageModule, USE_EMULATOR } from '@angular/fire/compat/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AuthGuard, hasCustomClaim, redirectUnauthorizedTo, AuthGuardModule } from '@angular/fire/auth-guard';

import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { USE_EMULATOR as USE_FUNCTION_EMULATOR } from '@angular/fire/compat/database';
import { InputFormComponent } from './home/form/input-form/input-form.component';
import { UpdateComponent } from './home/update/update.component';
import { AuthGuardService } from './services/auth.guard.Service';

//import {  USE_FIRESTORE_EMULATOR } from '@angular/fire/firestore';
//for redirect unauthorized to auth component
//const redirectUnauthorizedToLogin = ()=> redirectUnauthorizedTo('auth');
//Secure loggin to the component just authorized users
//const secureJustForAuthorizedUsers =()=> hasCustomClaim('admin');
const appRoutes:Routes = [
  { path:'', component:HomeComponent,
  children:[
    {path:'auth', component:AuthComponent},
    {path:'main', component:MainComponent,
       canActivate:[AuthGuardService]
    },
    {path:'products', component:ProductsComponent,
       canActivate:[AuthGuardService]
      //canActivate:[AuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin}
    },
    {path:'inputForm', component:InputFormComponent},
    {path:'update', component:UpdateComponent}
  ]},



  /*
  canActivate:[AuthGuard],
  data:{
    authGuardPipe: redirectUnauthorizedToLogin
  },
  */
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    ProductsComponent,
    MainComponent,
    InputFormComponent,
    UpdateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AuthGuardModule,
    provideFirestore(()=>getFirestore()),
    provideFirebaseApp(()=> initializeApp(environment.firebase)),

    //provideAuth

    //provideFirestore
    //provideFunctions



    HttpClientModule,
    RouterModule.forRoot(appRoutes),

  ],
  providers: [
    //{provide:USE_AUTH_EMULATOR, useValue:environment.useEmulators?['https://localhost:',9099]:undefined},
    //{provide:USE_FIRESTORE_EMULATOR, useValue:environment.useEmulators?['localhost',8080]:undefined},
    //{provide:USE_FUNCTION_EMULATOR, useValue:environment.useEmulators?['https://localhost:',5001]:undefined},
    {provide:HTTP_INTERCEPTORS, useClass:interceptorLogin, multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:AuthInterceptorService, multi:true},
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
