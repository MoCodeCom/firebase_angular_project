import { AfterViewChecked, Injectable, OnInit } from "@angular/core";
import { Firestore, collection, collectionData, doc } from "@angular/fire/firestore";
import { addDoc, deleteDoc, getDoc, getFirestore, query, updateDoc, where ,getDocs, CollectionReference, DocumentData, getDocFromServer, onSnapshot, runTransaction, orderBy, limit, startAfter, startAt, getCountFromServer} from "firebase/firestore";
import { Observable, concatMap, from, map, tap } from "rxjs";
import { ICourse } from "../home/interface/ICourse";

@Injectable({providedIn:"root"})
export class sFirebase implements OnInit{
    admissionIssue:boolean=false;
    oldDataToUpdate:ICourse = {courseId:'', courseName:'', courseDate:'', courseDescription:''};


    constructor(private db:Firestore){}

    ngOnInit(): void {
        this.deleteCoursesWithLessons();

    }

    getUsersDataByName(data:string){
        /*
        return new Observable<any>(()=>
        {
            let c = collection(this.db,'users');
            collectionData(c);
        });*/

        //return usersData;

        let c = collection(this.db,data);
        return collectionData(c);

        //let que= query(c, where("London","array-contains",name));
        //return collectionData(c);
    }

    observeReturen(){

        let fstore = collection(this.db,'courses');
        //console.log(fstore);
        return collectionData(fstore);

        /*
        return new Observable<any>(
            ()=>{
                let fstore = collection(this.db,'users');
                collectionData(fstore);

            }
        );*/
    }

    //**************CURD API*******************/

    getCourses(){
        /*
        const getF = getFirestore();
        const colref = collection(getF, 'courses');
        const q = query(colref);

        onSnapshot(q, (snap)=>{
            let books:any[] = [];
            snap.docs.forEach((doc) =>{
                books.push({... doc.data(), id:doc.id});
            });

            console.log(books);
        });*/
        //const getDb = getFirestore();
        let c = collection(this.db,'courses');

        return collectionData(c);
        /*
        .pipe(
            tap(res =>{})
        );*/
    }

    deleteCoursesWithLessons(){
        const getDb = getFirestore();
        let courseId = ''
        let collecitonData = collection(this.db,'courses');
        //let qry = query(collecitonData, where('courseId',"==",course.courseId));
        /*
        onSnapshot(qry, snap =>{
            snap.docs.forEach((ele)=>{
                courseId = ele.id;
            });
        });*/

        runTransaction(this.db, async res=>{
            console.log(res);
            const sfDoc = doc(this.db,"courses");
            const data = res.get(sfDoc);

            console.log(data);



        }).then(result =>{
            console.log(result);
        });

        let coldata = collection(this.db,'courses',courseId,'lessons');
        //console.log(coldata);
        return collectionData(coldata).pipe(
            tap(res =>{
                console.log(res);
            })
        );
    }

    async createCourse(newCourse: Partial<ICourse>, coursePath?:string){


        const col = collection(this.db, 'courses');
        const countCourses = await getCountFromServer(col);
        let idss = countCourses.data().count + 1;

        const courseData = doc(collection(this.db, 'id')).id;
        //console.log('id count:' + idsCount);
        newCourse.courseId = courseData;
        newCourse.id = idss;
        newCourse.coursePath = coursePath;

        return addDoc(collection(this.db, 'courses'), newCourse)
        //console.log(courseData);
    }

    deleteCourse(course:ICourse){
            let docId:string;
            let courseData = getFirestore();
            //to get all data in database collection
            let colRef = collection(courseData, 'courses');
            //to make firebase qurey to get specific data document
            let queryData = query(colRef, where("courseId","==",course.courseId));
            //snapshot to rename an id



          const snap = onSnapshot(queryData, snap =>{
                  snap.docs.forEach(element => {
                      docId = element.id;
                  });

                                     // check an id if it is exist
                                     if(docId == null){
                                      alert('This document is not exist.');
                                    }else{
                                      //delete document form database.
                                      //console.log(doc(this.db,'courses',docId));
                                      deleteDoc(doc(this.db,'courses',docId)).then(() =>{
                                          console.log('delete is successful.');
                                          this.ngOnInit();
                                      }).catch(err =>{
                                          console.log(err);
                                          //this.getCourses();
                                          //this.ngOnInit();
                                      });
                                  }
                 });

            return snap;
    }

    updateCourse(newCourse:any, oldCourse:any){
        let id = oldCourse.courseId;
        let getData = getFirestore();
        let colRef = collection(getData, 'courses');
        let qry = query(colRef, where("courseId","==",id));

       onSnapshot(qry, (res)=>{
        let docId = '';
        res.docs.forEach(ele =>{
            docId = ele.id;
        })


        let selectedDoc = doc(this.db,'courses',docId);
        return updateDoc(selectedDoc, newCourse);
       });


    }

    async getWithPagination(pageNumber?:number)/*:Observable<ICourse>*/{

        this.getCourses();
        const docData = collection(this.db, 'courses');
        if (pageNumber == null) pageNumber = 0;
        const qry = query(docData,
            orderBy('id', 'asc'),
            startAfter(pageNumber*2),
            limit(2),
            );
        const getDocQuery = await getDocs(qry);
        return getDocQuery;
    }


}
