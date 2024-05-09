import { makeAutoObservable } from "mobx";
import { User } from "./User";
import { Currency } from "./Currency";
import { Token } from "./Token";
import { Axios } from "@/api/Axios";

type UserCreateDTO = {
  username: string
  password: string
  email?: string
}

export class Store {
  user?: User

  currencies: Currency[] = []
  currency?: Currency
  tokens: Token[] = []
  tokensMap = new Map<string, Token>()
  constructor(){
    makeAutoObservable(this)
    this.setUser()
  }


  userFromProps(props: User){
    const user = new User(props.username, props._id, props.blocked, props.isAdmin, props.date_registered, props.email)
    return user
  }
  
  async setUser(){
    const props: User = (await Axios.get('/user')).data
    this.user = this.userFromProps(props)
  }
  
  async createUser(user: UserCreateDTO){
    await Axios.post('/user', user)
    await this.login(user)
  }
  
  async login(user: UserCreateDTO){
    const token:{access_token: string}=(await Axios.post('/user/login', user)).data
    localStorage.setItem('access_token', token.access_token)
    await this.setUser()
  }
  
  async deleteUser(){
    await Axios.delete('/user')
    this.user = undefined
  }
  
  async updateUser(user: Partial<UserCreateDTO>){
    const res: User = (await Axios.patch('/user', user)).data
    this.user && Object.assign(this.user, res)
  }
  
  logOut(){
    localStorage.removeItem('access_token')
    this.user = undefined
  };

  async setTokens(){
    const res = await Axios.get('/exchange/tokens')
    this.tokens = res.data
    this.tokensMap = new Map<string, Token>()
    for(const token of this.tokens){
      this.tokensMap.set(token.symbol, token)
    }

  }

  async setCurrencies(){
    const res = await Axios.get('/exchange/currencies')
    this.currencies = res.data
  }
}



export const StoreInstance = new Store()
StoreInstance.setTokens()
setInterval(StoreInstance.setTokens.bind(StoreInstance), 1000 * 60 * 10)
StoreInstance.setCurrencies()       
setInterval(StoreInstance.setCurrencies.bind(StoreInstance), 1000 * 60 * 60 * 24)