export class User{
  constructor(
      public username: string,
      public _id: string,
      public blocked: string,
      public isAdmin: string,
      public date_registered: string,
      public email?: string,
  ){
    
  }
}