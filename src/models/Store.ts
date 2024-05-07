import { makeAutoObservable, observable } from "mobx";
import { Portfolio } from "./Portfolio/Portfolio";
import { User } from "./User/User";
import { getUser } from "@/models/User/Api";

export class Store {
  user?: User
  portfolio?: Portfolio 
  loading: boolean = true
  constructor(){
    makeAutoObservable(this)
  }
}



export const StoreInstance = new Store()

getUser().then( user=>StoreInstance.user = user )