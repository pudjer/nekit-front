import { makeAutoObservable } from "mobx"
import { StoreInstance } from "./Store"
import { Axios } from "@/api/Axios"

export class SpotPosition{
  constructor(
    public portfolioId: string,
    public _id: string,
    public symbol: string,
    public quantity: number,
    public timestamp: string,
    public initialPrice: number,
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
    return this.getCurrentPrice() - this.initialPrice
  }
  getVolumeChange(){
    return this.getPriceChange()*this.quantity
  }
  getInitialVolume(){
    return this.initialPrice*this.quantity
  }
  async update(upd: CreateSpotPositionDTO){
    const res: SpotPosition = (await Axios.patch(`/spot/${this._id}`, upd)).data
    Object.assign(this, res)
  }

}

export type CreateSpotPositionDTO = {
  symbol: string,
  quantity: number,
  timestamp: string,
  initialPrice: number,
}