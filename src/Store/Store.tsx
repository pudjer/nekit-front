import { makeAutoObservable } from "mobx";
import { User } from "./User";
import { Currency } from "./Currency";
import { Token } from "./Token";
import { Axios } from "@/api/Axios";
import { Typography } from "@mui/material";
type Glob = {
  "eth_dominance": 15.54915795644,
  "btc_dominance": 53.204077126219,
  "total_market_cap": 2251885193123.512,
  "total_volume_24h": 67644895476.9,
}



type UserCreateDTO = {
  username: string
  password: string
  email?: string
}

export class Store {
  user?: User
  isLoading = true
  currencies: Currency[] = []
  currency?: Currency
  tokens: Token[] = []
  tokensMap = new Map<string, Token>()
  global?: Glob
  constructor(){
    makeAutoObservable(this)
    const loading = []
    loading.push(this.setUser())
    loading.push(this.setTokens())
    loading.push(this.setCurrencies().then(()=>{this.currency = this.currencies[0] || undefined}))    
    loading.push(this.setGlobal())   
    setInterval(this.setGlobal.bind(this), 1000 * 60 * 10)
    setInterval(this.setTokens.bind(this), 1000 * 60 * 10)
    setInterval(this.setCurrencies.bind(this), 1000 * 60 * 60 * 24)
    Promise.all(loading).then(()=>{this.isLoading = false})
  }


  userFromProps(props: User){
    const user = new User(props.username, props._id, props.blocked, props.isAdmin, props.date_registered, props.email)
    return user
  }
  async setGlobal(){
    const glob : Glob = (await Axios.get("exchange/global")).data
    this.global = glob
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

  convertFromUSD(p: number):[number, string]{
    return this.currency ? [p * this.currency.exchangeRateToUsd , " "+this.currency.symbol] : [p,' USD']
  }
  formatChange(price: number, curr: string, nice = price){
    return <Typography color={nice<0?"error":"lightgreen"}>{(nice>0?'+':'')+price.toLocaleString()+curr}</Typography>
  }
}



export const StoreInstance = new Store()
