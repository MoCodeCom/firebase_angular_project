import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Firestore, Timestamp, addDoc, collection } from 'firebase/firestore';
import { sFirebase } from 'src/app/services/sFirebase.service';
import { Observable, catchError, concatMap, pipe, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref } from 'firebase/storage'


@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {

  percantage:Observable<number>;
  iconUrl:string;

  constructor(private fb:FormBuilder,
              private fs:sFirebase,
              private router:Router,
              private serviceFirebase:sFirebase,
              private storage: AngularFireStorage
              ){}
  ngOnInit(): void {}



  onCreateCourse(form:NgForm){
    const formData = form.value;

    //const formDatainfo = Timestamp.fromDate(formData.value);
    this.router.navigateByUrl("/products");
    this.fs.createCourse(formData,this.iconUrl).catch(err =>{
      //To gat an error when the adding is not permission
      console.log(err);
      alert('Missing or insufficient permissions!');
    });
    //const fData = this.fs.createCourse(formData);
    /*return new Observable<void>(()=>{

    }).pipe(
      tap(data =>{
        console.log('test start...');
        console.log(data);
      }),
      catchError(err =>{
        console.log(err);
        return throwError(err);
      }
    ))*/
    //console.log(formDatainfo);
  }

  onUploadFile(data){
    const file:File = data.target.files[0];
    console.log(file.name);

    const filePath = `courses/images/${file.name}`;

    const task = this.storage.upload(filePath, file, {
      cacheControl: "max-age=259200,public"
    });

    this.percantage = task.percentageChanges();
    task.snapshotChanges()
    .pipe(
      //last(),
      concatMap(()=>this.storage.ref(filePath).getDownloadURL()),
      tap(url =>this.iconUrl = url),
      catchError(err => {
        console.log(err);
        alert('could not create thumbnail url.');
        return throwError(err);
      })
    )
    .subscribe();

    /*
    const storages = getStorage();
    const refs = ref(storages, file.name);
    const refsImages = ref(storages, 'images/'+(refs.name));
    refs.name === refsImages.name;
    refs.fullPath === refsImages.fullPath;*/
  }


}
