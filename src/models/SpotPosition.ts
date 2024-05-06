export class FuturesPosition{
  constructor(
    public portfolioId: string,
    public _id: string,
    public symbol: string,
    public quantity: number,
    public typestamp: Date,
    public initialPrice: number,
  ){}
}