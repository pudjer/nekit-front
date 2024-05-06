import { observable } from "mobx";
import { Portfolio } from "./Portfolio";
import { User } from "./User";
import { getUser } from "@/api/requests/User";

export class Store {
  @observable user?: User
  @observable portfolio?: Portfolio 
  @observable loading: boolean = true
}



export const StoreInstance = new Store()

getUser().then( user=>StoreInstance.user = user )