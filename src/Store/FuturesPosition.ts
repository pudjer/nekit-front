import { makeAutoObservable } from "mobx"
import { StoreInstance } from "./Store"
import { Axios } from "@/api/Axios"
import { Position } from "./PositionInterface"

export class FuturesPosition implements Position{
  static fromProps(props: FuturesPosition){
    const portfolio = new FuturesPosition(
      props.portfolioId,
      props._id,
      props.symbol,
      props.currency,
      props.quantity,
      props.margin,
      props.leverage,
      props.timestamp,
      props.initialPrice,
      props.stopLoss,
      props.takeProfit,
      props.exitPrice
    )
    return portfolio
  }
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
    if(this.exitPrice)return this.exitPrice
    const symbol = StoreInstance.tokensMap.get(this.symbol)
    if(symbol && this.quantity){
      if(this.quantity>0){
        if(this.takeProfit && this.takeProfit>=symbol.current_price)return this.takeProfit
        if(this.stopLoss && this.stopLoss<=symbol.current_price)return this.stopLoss
      }else{
        if(this.takeProfit && this.takeProfit<=symbol.current_price)return this.takeProfit
        if(this.stopLoss && this.stopLoss>=symbol.current_price)return this.stopLoss
      }
      if(this.margin + (symbol.current_price * this.quantity - this.initialPrice * this.quantity) <= 0){
        return this.initialPrice - (this.margin / this.quantity)
      }
    }
    if(!symbol)return 0
    return symbol.current_price
  }

  getPriceChange(){
    return (this.getCurrentPrice())-this.initialPrice
  }
  getValueChange(){
    return this.getValue() - this.getInitialValue()
  }

  getInitialValue() {
    return this.margin
  }
  getPriceChangePerc(){
    return ((this.getCurrentPrice() / this.initialPrice) - 1) * 100
  }
  
  getValue(){
    const volume  = this.margin + (this.getCurrentPrice() * this.quantity - this.initialPrice * this.quantity)
    return volume >= 0 ? volume : 0
  }
  getValueChangePerc(){
    return ((this.getValue() / this.margin) - 1) * 100
  }
  async update(upd: CreateFuturesPositionDTO){
    const res: FuturesPosition = (await Axios.patch(`/futures/${this._id}`, upd)).data
    Object.assign(this, res)
  }
  getPortfolioPerc(){
    const portfolioValue = Math.abs(StoreInstance.portfolio!.getValue())
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