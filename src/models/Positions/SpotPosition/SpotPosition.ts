export class SpotPosition{
  constructor(
    public portfolioId: string,
    public _id: string,
    public symbol: string,
    public quantity: number,
    public typestamp: Date,
    public initialPrice: number,
  ){}
}

export type CreateSpotPositionDTO = {
  portfolioId: string,
  symbol: string,
  quantity: number,
  typestamp: Date,
  initialPrice: number,
}