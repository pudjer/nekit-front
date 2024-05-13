import { makeAutoObservable } from "mobx"
import { StoreInstance } from "./Store"
import { Axios } from "@/api/Axios"
import { Position } from "./PositionInterface"

export class FuturesPosition implements Position{
  constructor(
    public portfolioId: string,
    public _id: string,
    public symbol: string,
    public currency: string,
    public quantity: number,
    public margin: number,
    public leverage: number,
    public timestamp: string,
    public initialPrice: number,
    public stopLoss?: number,
    public takeProfit?: number,
    public exitPrice?: number,
  ){
    makeAutoObservable(this)
  }

  getCurrentPrice(){
    const symbol = StoreInstance.tokensMap.get(this.symbol)
    if(!symbol)return 0
    return symbol.current_price
  }
  getCurrentVolume(){
    return (this.exitPrice || this.getCurrentPrice())*this.quantity
  }
  getPriceChange(){
    return (this.exitPrice || this.getCurrentPrice())-this.initialPrice
  }
  getValueChange(){
    return this.getCurrentVolume() - this.getInitialVolume()
  }
  getInitialVolume(){
    return this.initialPrice*this.quantity
  }
  getInitialValue() {
    return this.margin
  }
  getPriceChangePerc(){
    return (((this.exitPrice || this.getCurrentPrice()) / this.initialPrice) - 1) * 100
  }
  getVolumeChangePerc(){
    return ((this.getCurrentVolume() / this.getInitialVolume()) - 1) * 100
  }
  getValue(){
    return this.margin + this.getValueChange()
  }
  getValueChangePerc(){
    return ((this.getValue() / this.margin) - 1) * 100
  }
  async update(upd: CreateFuturesPositionDTO){
    const res: FuturesPosition = (await Axios.patch(`/futures/${this._id}`, upd)).data
    Object.assign(this, res)
  }
  getPortfolioPerc(){
    const portfolioValue = Math.abs(StoreInstance.user!.portfolio!.getValue())
    return (this.getValue() / portfolioValue) * 100
  }
}

export type CreateFuturesPositionDTO = {
  symbol: string
  currency: string
  quantity: number
  margin: number
  leverage: number
  timestamp: string
  initialPrice: number,
  stopLoss?: number
  takeProfit?: number
  exitPrice?: number

}