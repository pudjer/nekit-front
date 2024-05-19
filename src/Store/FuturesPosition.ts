import { makeAutoObservable } from "mobx"
import { StoreInstance } from "./Store"
import { Axios } from "@/api/Axios"
import { Position } from "./PositionInterface"
export interface ValueMark{
  timestamp: Date;

  value: number;

}
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
      props.initialCurrencyPrice,
      props.stopLoss,
      props.takeProfit,
      props.exitPrice,
      props.exitTimestamp
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
    public initialCurrencyPrice: number,

    public stopLoss?: number,
    public takeProfit?: number,
    public exitPrice?: number,
    public exitTimestamp?: string,
  ){
    makeAutoObservable(this)
  }

  getCurrentPrice(){
    if(this.exitPrice)return this.exitPrice
    const tokenPrice = StoreInstance.tokensMap.get(this.symbol)?.current_price
    const currentRate = StoreInstance.currencyMap.get(this.currency)?.exchangeRateToUsd
    const currentPrice = tokenPrice && currentRate && (tokenPrice * currentRate)
    if(currentPrice && this.quantity){
      if(this.quantity<0){
        if(this.takeProfit && this.takeProfit>=currentPrice)return this.takeProfit
        if(this.stopLoss && this.stopLoss<=currentPrice)return this.stopLoss
      }else{
        if(this.takeProfit && this.takeProfit<=currentPrice)return this.takeProfit
        if(this.stopLoss && this.stopLoss>=currentPrice)return this.stopLoss
      }
      if(this.margin + (this.quantity * (currentPrice - this.initialPrice)) <=0){
        return this.initialPrice-(this.margin /this.quantity)
      }
    }
    if(!tokenPrice)return 0
    return currentPrice || 0
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
    const volume  = this.margin + ((this.getCurrentPrice() * this.quantity) - (this.initialPrice * this.quantity))
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
    const currentRate = StoreInstance.currencyMap.get(this.currency)?.exchangeRateToUsd

    return currentRate ? ((this.getValue() / currentRate )/ portfolioValue) * 100 : 0
  }
}

export interface CreateFuturesPositionDTO {
  symbol: string,
  currency: string,
  quantity: number,
  margin: number,
  leverage: number,
  timestamp: string,
  initialPrice: number,
  initialCurrencyPrice: number,
  stopLoss?: number,
  takeProfit?: number,
  exitPrice?: number,
  exitTimestamp?: string,

}