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
  static fromProps(props: User){
    //@ts-ignore
    const user = new User(props.username, props._id, props.blocked, props.isAdmin, props.date_registered, props.email, props.tgId, props.favoritePortfolios)
    return user
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
      const portfs = res.map(e=>Portfolio.fromProps(e.data))
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

  
  async updatePortfolios(){
    const portfolios: Portfolio[] = (await Axios.get('/portfolios')).data
    this.portfolios = portfolios.map(e=>Portfolio.fromProps(e))
  }
  


  async createPortfolio(props : createPortfolioDTO ){
    const res: Portfolio = (await Axios.post('/portfolios', props)).data
    StoreInstance.portfolio = Portfolio.fromProps(res)
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