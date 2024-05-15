import { makeAutoObservable } from "mobx"
import { StoreInstance } from "./Store"
import { Axios } from "@/api/Axios"
import { Position } from "./PositionInterface"

export class SpotPosition implements Position{
  constructor(
    public portfolioId: string,
    public _id: string,
    public symbol: string,
    public quantity: number,
    public timestamp: string,
    public initialPrice: number,
    public exitPrice?: number
  ){
    makeAutoObservable(this)
  }

  getCurrentPrice(){
    const symbol = StoreInstance.tokensMap.get(this.symbol)
    if(this.exitPrice)return this.exitPrice
    if(!symbol)return 0
    return symbol.current_price
  }
  getValue(){
    return (this.getCurrentPrice())*this.quantity
  }
  getPriceChange(){
    return ( this.getCurrentPrice()) - this.initialPrice
  }
  getValueChange(){
    return this.getPriceChange()*this.quantity
  }
  getInitialValue(){
    return this.initialPrice*this.quantity
  }
  getCurrentVolume(){
    return (this.getCurrentPrice())*this.quantity
  }
  getValueChangePerc(){
    return (((this.getCurrentPrice()) / this.initialPrice) - 1) * 100
  }
  getPriceChangePerc(){
    return (((this.getCurrentPrice()) / this.initialPrice) - 1) * 100
  }
  async update(upd: CreateSpotPositionDTO){
    const res: SpotPosition = (await Axios.patch(`/spot/${this._id}`, upd)).data
    Object.assign(this, res)
  }
  getPortfolioPerc(){
    const portfolioValue = Math.abs(StoreInstance.portfolio!.getValue())
    return (this.getValue() / portfolioValue) * 100
  }

}

export type CreateSpotPositionDTO = {
  symbol: string,
  quantity: number,
  timestamp: string,
  initialPrice: number,
  exitPrice?: number

}