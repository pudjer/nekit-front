import { makeAutoObservable } from "mobx";
import { User } from "./User";
import { Currency } from "./Currency";
import { Token } from "./Token";
import { Axios } from "@/api/Axios";
import { Typography } from "@mui/material";
import { AxiosError } from "axios";
import { Portfolio } from "./Portfolio";
type Glob = {
  "eth_dominance": number,
  "btc_dominance": number,
  "total_market_cap": number,
  "total_volume_24h": number,
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
  currencyMap = new Map<string, Currency>()
  tokens: Token[] = []
  tokensMap = new Map<string, Token>()
  portfolio?: Portfolio
  global?: Glob
  error?: AxiosError
  constructor(){
    makeAutoObservable(this)
    const loading = []
    loading.push(this.setUser())
    loading.push(this.setTokens().catch(e=>this.error=e))
    loading.push(this.setCurrencies().then(()=>{this.currency = this.currencies[0] || undefined}).catch(e=>this.error=e))    
    loading.push(this.setGlobal().catch(e=>this.error = e))   
    setInterval(this.setGlobal.bind(this), 1000 * 60 * 10)
    setInterval(this.setTokens.bind(this), 1000 * 60 * 10)
    setInterval(this.setCurrencies.bind(this), 1000 * 60 * 60 * 24)
    Promise.allSettled(loading).then(()=>{this.isLoading = false})
  }

  async setPortfolioFromHref(){
    const portfolioId = (new URL(location.href)).searchParams.get('portfolio')
    if(typeof portfolioId === 'string' && portfolioId.length){
      const res = (await Axios.get(`/portfolios/${portfolioId}`)).data
      StoreInstance.portfolio = Portfolio.fromProps(res)
    }
  }

  async setGlobal(){
    const glob : Glob = (await Axios.get("/exchange/global")).data
    this.global = glob
  }
  async setUser(){
    const props: User = (await Axios.get('/user')).data
    this.user = User.fromProps(props)
  }
  
  async createUser(user: UserCreateDTO){
    await Axios.post('/user', user)
    await this.login(user)
  }
  
  async login(user: UserCreateDTO): Promise<true | void>{
    const token: AuthToken=(await Axios.post('/user/login', user)).data
    if(token.tgrequired === true){
      return true
    }
    localStorage.setItem('access_token', token.access_token)
    await this.setUser()
  }
  async tgLogin(pass: number, username: string, password: string){
    const body: TgPassword = { tgPassword: pass, username, password}
    const token: AuthToken=(await Axios.post('/user/tgauth', body)).data
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
    const curMap = new Map<string, Currency>()
    for(const cur of this.currencies){
      curMap.set(cur.symbol, cur)
    }
    this.currencyMap = curMap
  }

  convertFromUSD(p: number | undefined, currency?: string):[number, string]{
    if(p===undefined)return [NaN, 'N/A']
    const cur = this.currencies.find(e=>(e.symbol === currency)) || this.currency
    return cur ? [p * cur.exchangeRateToUsd , " "+cur.symbol] : [p,' USD']
  }
  formatChange(price: number, curr: string, nice = price){
    return <Typography color={nice<0?"error":"lightgreen"}>{(nice>0?'+':'')+(price ? price.toLocaleString()+' '+curr : "N/A")}</Typography>
  }
}



export const StoreInstance = new Store()

export interface AuthToken{access_token: string, tgrequired?: true}
export interface TgPassword{
  username: string
  tgPassword: number
  password: string
}