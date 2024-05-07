export class FuturesPosition{
  constructor(
    public portfolioId: string,
    public _id: string,
    public symbol: string,
    public currency: string,
    public quantity: number,
    public margin: number,
    public leverage: number,
    public typestamp: Date,
    public initialPrice: number,
    public stopLoss: number,
    public takeProfit: number,
  ){}
}

export type CreateFuturesPositionDTO = {
  portfolioId: string
  symbol: string
  currency: string
  quantity: number
  margin: number
  leverage: number
  typestamp: Date
  initialPrice: number,
  stopLoss: number
  takeProfit: number
}