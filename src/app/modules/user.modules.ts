export class UserModule{
    constructor(
        public email:string,
        public id:string,
        public refreshToken:string
    ){}
    
    get token(){
       if(!this.id){
           return null;
        }
        return this.id;
    }

}