import { makeAutoObservable } from "mobx";
import { Portfolio } from "./Portfolio/Portfolio";
import { User } from "./User/User";
import { getUser } from "@/models/User/Api";
import { Currency } from "./Currency";
import { Token } from "./Token";
import { Axios } from "@/api/Axios";

export class Store {
  user?: User
  portfolio?: Portfolio 
  currencies: Currency[] = []
  currency?: Currency
  tokens: Token[] = []
  constructor(){
    makeAutoObservable(this)
  }
}



export const StoreInstance = new Store()



const setTokens = async ()=>{
  const res = await Axios.get('/exchange/tokens')
  StoreInstance.tokens = res.data
}
setTokens()
setInterval(setTokens, 1000 * 60 * 10)

const setCurrencies = async ()=>{
  const res = await Axios.get('/exchange/currencies')
  StoreInstance.currencies = res.data
}
setCurrencies()
setInterval(setCurrencies, 1000 * 60 * 60 * 24)
getUser().then( user=>StoreInstance.user = user )