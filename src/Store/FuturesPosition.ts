import { makeAutoObservable } from "mobx"
import { StoreInstance } from "./Store"
import { Axios } from "@/api/Axios"

export class FuturesPosition{
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
    public stopLoss: number,
    public takeProfit: number,
  ){
    makeAutoObservable(this)
  }

  getCurrentPrice(){
    const symbol = StoreInstance.tokensMap.get(this.symbol)
    if(!symbol)return 0
    return symbol.current_price
  }
  getCurrentVolume(){
    return this.getCurrentPrice()*this.quantity
  }
  getPriceChange(){
    return this.initialPrice - this.getCurrentPrice()
  }
  getVolumeChange(){
    return this.getPriceChange()*this.quantity
  }
  getInitialVolume(){
    return this.initialPrice*this.quantity
  }
  async update(upd: CreateFuturesPositionDTO){
    const res: FuturesPosition = (await Axios.patch(`/futures/${this._id}`, upd)).data
    Object.assign(this, res)
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
  stopLoss: number
  takeProfit: number
}