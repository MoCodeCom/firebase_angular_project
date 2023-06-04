import { Component, OnInit } from '@angular/core';

import { Firestore, collectionData, doc } from '@angular/fire/firestore';
import { collection, query, where } from 'firebase/firestore';
import { sFirebase } from 'src/app/services/sFirebase.service';
import { NgForm } from '@angular/forms';
import { Observable, from } from 'rxjs';


//import { Observable } from 'rxjs';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userDatabase:{address:string, course:string, full_name:string}[] = [];
  lessonsArr:any[] = [];
  arr:any[]=[]
  constructor(private fs:Firestore, private fService:sFirebase) { }
  ngOnInit(): void {
    //this.onGetData('users');
    //this.onLocalData();
  }




  onSubmitForm(data: NgForm) {
    console.log(data.value);
    const info = { username: data.value['username'], password: data.value['password'] };



    //this.http.post('url',{username:data.value['username'],password:data.value['password']});
    data.reset();
  }

  /*To get data form stor*/
  onGetData(collName:string){

    this.fService.getUsersDataByName(collName).subscribe(
      data =>{
        console.log(data);
      }
    );



    /*.pipe(
      tap(data =>{
        console.log(data["address"]);
      })
      );*/

    /*
    let users = collection( this.fs,'users');
    //console.log(users);
    return collectionData(users)
    .subscribe(
      data =>{
        this.lessonsArr =[];
        this.arr = [];
        data.forEach(ele => {
          //this.userDatabase.push(ele)
          this.arr.push(ele);
          console.log(ele);
        });
      }
    );
    */
  }

  onGetAngularLessons(){
    let lessons = collection(this.fs, 'users/8D8jqYzGkqqJ3Asi2WVq/lessons');
    let qry = query(lessons, where('lesson','==','routes'));
    return collectionData(qry)
    .subscribe(data =>{
      this.lessonsArr =[];
        this.arr = [];
      data.forEach(ele =>{
        this.lessonsArr.push(ele);
      });
      console.log(data);
    });
  }

  onObserve(){
    /*
    return this.fService.observeReturen().pipe(
      tap(value => console.log(value))
    );*/

    /*
    const result = from(this.fService.observeReturen());
    //console.log(result);
    return result.pipe(
      tap(x => console.log(x))
    );*/

    const obs = new Observable(sub=>{
      sub.next(()=>{
        console.log('start ...');
        this.fService.observeReturen();
      });
    }).subscribe(data =>{
      console.log(data);
      this.fService.observeReturen();
    });

    console.log(obs);
    obs;
    //return this.fService.observeReturen();

  }

  onLocalData(){
    /*
    this.fService.getCourses().subscribe(data =>{
      console.log(data);
    });*/
  }
  onAddData(){}

  onDeleteData(){}
}


