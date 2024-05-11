export interface Position{
  portfolioId: string,
  _id: string,
  symbol: string,
  quantity: number,
  timestamp: string,
  initialPrice: number,
  exitPrice?: number
  getCurrentPrice(): number
  getCurrentVolume():number
  getPriceChange(): number
  getPriceChangePerc(): number
  getValue(): number
  getValueChange(): number
  getPortfolioPerc(): number
  getInitialValue(): number
  getValueChangePerc(): number


}