import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { sFirebase } from 'src/app/services/sFirebase.service';
import { ICourse } from '../interface/ICourse';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit{
  
  constructor(private router:Router, private serviceFirebase:sFirebase){}
  ngOnInit(): void {
    
  }
  oldDataToUpdate:ICourse = {courseId:'', courseName:'', courseDate:'', courseDescription:''};


  onUpdateCourse(data:NgForm){

    
    //old data
    //convert data from local storage to object in code.
    let oldData:any= localStorage.getItem(JSON.parse('"updatedata"'));
    let oldObject = JSON.parse(oldData);
    this.oldDataToUpdate = oldObject;
    
    //var t = JSON.parse(oldData);

    //new data
      this.serviceFirebase.updateCourse(data.value, oldObject);
      this.router.navigateByUrl('/products');

    //clear storage
    localStorage.removeItem('updatedata');
    
      
  }

  onCancel(){
    this.router.navigateByUrl('/products');
    localStorage.removeItem('updatedata');
  }
}
