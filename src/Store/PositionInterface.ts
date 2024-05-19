export interface Position{
  currency?: string,
  portfolioId: string,
  _id: string,
  symbol: string,
  quantity: number,
  timestamp: string,
  initialPrice: number,
  exitPrice?: number,
  exitTimestamp?: string,
  getCurrentPrice(): number
  getPriceChange(): number
  getPriceChangePerc(): number
  getValue(): number
  getValueChange(): number
  getPortfolioPerc(): number
  getInitialValue(): number
  getValueChangePerc(): number


}