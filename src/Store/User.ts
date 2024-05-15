import { makeAutoObservable } from "mobx"
import { Portfolio } from "./Portfolio"
import { Axios } from "@/api/Axios"
import { StoreInstance } from "./Store"


export type createPortfolioDTO = {
  description?: string
  name: string
  isPublic?: string
}

export class User{
  static fromProps(props: Portfolio) {
    const portfolio = new Portfolio(props._id, props.userId, props.description, props.name, props.isPublic)
    return portfolio
  }
  portfolios?: Portfolio[]
  favoritePortfolios: Portfolio[]

  constructor(
      public username: string,
      public _id: string,
      public blocked: string,
      public isAdmin: string,
      public date_registered: string,
      public email?: string,
      public tgId?: string,
      favoritePortfolios: string[] = [],
  ){
    makeAutoObservable(this)
    this.updatePortfolios()
    const promises = favoritePortfolios.map((e: any)=>Axios.get(`/portfolios/${e}`))
    this.favoritePortfolios = []
    Promise.all(promises).then(res=>{
      console.log(res)
      const portfs = res.map(e=>this.fromProps(e.data))
      this.favoritePortfolios = portfs
    })
  }



  async addFavorite(portf: Portfolio){
    await Axios.post(`/user/favorite/${portf._id}`)
    this.favoritePortfolios.push(portf)
  }
  async deleteFavorite(portf: Portfolio){
    await Axios.delete(`/user/favorite/${portf._id}`)
    this.favoritePortfolios = this.favoritePortfolios.filter(e=>e!==portf)
  }
  fromProps(props: Portfolio){
    const portfolio = new Portfolio(props._id, props.userId, props.description, props.name, props.isPublic)
    return portfolio
  }
  
  async updatePortfolios(){
    const portfolios: Portfolio[] = (await Axios.get('/portfolios')).data
    this.portfolios = portfolios.map(e=>this.fromProps(e))
  }
  
  async setPortfolioFromHref(){
    const portfolioId = (new URL(location.href)).searchParams.get('portfolio')
    if(typeof portfolioId === 'string' && portfolioId.length){
      const res = (await Axios.get(`/portfolios/${portfolioId}`)).data
      StoreInstance.portfolio = this.fromProps(res)
    }
  }

  async createPortfolio(props : createPortfolioDTO ){
    const res: Portfolio = (await Axios.post('/portfolios', props)).data
    StoreInstance.portfolio = this.fromProps(res)
    if(this.portfolios)this.portfolios = [...this.portfolios, StoreInstance.portfolio]
  }
  
  
  
  async deletePortfolio(id: string){
    await Axios.delete(`/portfolios/${id}`)
    if(StoreInstance.portfolio?._id === id){
      StoreInstance.portfolio = undefined
    }
    if(this.portfolios)this.portfolios = this.portfolios.filter(e=>e._id !== id)
  }
  
  async updatePortfolio(id: string, portfolio: Partial<createPortfolioDTO>){
    const res: Portfolio = (await Axios.patch(`/portfolios/${id}`, portfolio)).data
    const portf = this.portfolios?.find(e=>e._id === id)
    if(portf)Object.assign(portf, res)
    StoreInstance.portfolio = portf
  }
}