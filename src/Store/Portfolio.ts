import { makeAutoObservable } from "mobx";
import { CreateSpotPositionDTO, SpotPosition } from "./SpotPosition";
import { CreateFuturesPositionDTO, FuturesPosition } from "./FuturesPosition";
import { Axios } from "@/api/Axios";

export class Portfolio{
  spotPositions?: SpotPosition[]
  futuresPositions?: FuturesPosition[]

  constructor(
    public _id: string,
    public userId: string,
    public description: string,
    public name: string
  ){
    makeAutoObservable(this)
    this.updatePositions()
  }

  SpotFromProps(props: SpotPosition){
    const portfolio = new SpotPosition(
      props.portfolioId,
      props._id,
      props.symbol,
      props.quantity,
      props.timestamp,
      props.initialPrice,
      props.exitPrice
    )
    return portfolio
  }
  async updatePositions(){
    const portfolioId = this._id
    const spot: SpotPosition[] = (await Axios.get(`/spot/all?portfolioId=${portfolioId}`)).data
    const futures: FuturesPosition[] = (await Axios.get(`/futures/all?portfolioId=${portfolioId}`)).data
    this.spotPositions = spot.map(e=>this.SpotFromProps(e))
    this.futuresPositions = futures.map(e=>this.FuturesFromProps(e))

  }
  
  async createSpotPosition(props : CreateSpotPositionDTO ){
    const pos = Object.assign({portfolioId: this._id}, props)
    const res: SpotPosition = (await Axios.post('/spot', pos)).data
    if(this.spotPositions)this.spotPositions = [...this.spotPositions, this.SpotFromProps(res)]
  }
  
  async deleteSpotPosition(id: string){
    await Axios.delete(`/spot/${id}`)
    this.spotPositions = this.spotPositions?.filter(e=>e._id!==id)

  }
  async getSpotPosition(id: string){
    await Axios.get(`/spot/${id}`)
  }

  


  FuturesFromProps(props: FuturesPosition){
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
  
  
  async createFuturesPosition(props : CreateFuturesPositionDTO ){
    const pos = Object.assign({portfolioId: this._id}, props)
    const res: FuturesPosition = (await Axios.post('/futures', pos)).data
    if(this.futuresPositions)this.futuresPositions = [...this.futuresPositions, this.FuturesFromProps(res)]

  }
  
  async deleteFuturesPosition(id: string){
    await Axios.delete(`/futures/${id}`)
    this.futuresPositions = this.futuresPositions?.filter(e=>e._id!==id)
  }
  async getFuturesPosition(id: string){
    await Axios.get(`/futures/${id}`)
  }

  getCurrentValue(){
    let sum = 0
    if(this.spotPositions){
      for(const pos of this.spotPositions){
        sum = sum + pos.getCurrentVolume()
      }
    }
    if(this.futuresPositions){
      for(const pos of this.futuresPositions){
        sum = sum + pos.getValue()
      }
    }
    return sum
  }

  getIncomePerc(){
    let initialSum = 0
    if(this.spotPositions){
      for(const pos of this.spotPositions){
        initialSum = initialSum + pos.getInitialVolume()
      }
    }
    if(this.futuresPositions){
      for(const pos of this.futuresPositions){
        initialSum = initialSum + pos.margin
      }
    }
    return ((this.getCurrentValue() / initialSum)-1) * 100
  }

  

  getVolumeChange(){
    let sum = 0
    if(this.spotPositions){
      for(const pos of this.spotPositions){
        sum = sum + pos.getVolumeChange()
      }
    }
    if(this.futuresPositions){
      for(const pos of this.futuresPositions){
        sum = sum + pos.getVolumeChange()
      }
    }
    return sum
  }




  

}


