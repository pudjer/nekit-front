import { makeAutoObservable } from "mobx"
import { Portfolio } from "./Portfolio"
import { Axios } from "@/api/Axios"


export type createPortfolioDTO = {
  description?: string
  name: string
}

export class User{
  portfolios?: Portfolio[]
  portfolio?: Portfolio 
  constructor(
      public username: string,
      public _id: string,
      public blocked: string,
      public isAdmin: string,
      public date_registered: string,
      public email?: string,
  ){
    makeAutoObservable(this)
    this.updatePortfolios()
  }


  fromProps(props: Portfolio){
    const portfolio = new Portfolio(props._id, props.userId, props.description, props.name)
    return portfolio
  }
  
  async updatePortfolios(){
    const portfolios: Portfolio[] = (await Axios.get('/portfolios')).data
    this.portfolios = portfolios.map(e=>this.fromProps(e))

  }
  
  setPortfolioFromHref(){
    const portfolioId = location.href.split('=')[1]
    if(typeof portfolioId === 'string' && portfolioId.length){
      this.portfolio = this.portfolios?.find(e=>e._id===portfolioId)
    }
  }

  async createPortfolio(props : createPortfolioDTO ){
    const res: Portfolio = (await Axios.post('/portfolios', props)).data
    this.portfolio = this.fromProps(res)
    if(this.portfolios)this.portfolios = [...this.portfolios, this.portfolio]
  }
  
  
  
  async deletePortfolio(id: string){
    await Axios.delete(`/portfolios/${id}`)
    if(this.portfolio?._id === id){
      this.portfolio = undefined
    }
    if(this.portfolios)this.portfolios = this.portfolios.filter(e=>e._id !== id)
  }
  
  async updatePortfolio(id: string, portfolio: Partial<createPortfolioDTO>){
    const res: Portfolio = (await Axios.patch(`/portfolios/${id}`, portfolio)).data
    const portf = this.portfolios?.find(e=>e._id === id)
    if(portf)Object.assign(portf, res)
    this.portfolio = portf
  }
}