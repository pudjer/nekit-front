import { Axios } from "@/api/Axios"
import { CreateFuturesPositionDTO, FuturesPosition } from "./FuturesPosition"

export const fromProps = (props: FuturesPosition) => {
  const portfolio = new FuturesPosition(
    props.portfolioId,
    props._id,
    props.symbol,
    props.currency,
    props.quantity,
    props.margin,
    props.leverage,
    props.typestamp,
    props.initialPrice,
    props.stopLoss,
    props.takeProfit,
  )
  return portfolio
}

export const getPositionsByPortfolioId = async (portfolioId: string) => {
  const portfolios: FuturesPosition[] = (await Axios.get(`/futures/${portfolioId}`)).data
  return portfolios.map(e=>fromProps(e))
}



export const createFuturesPosition = async (props : CreateFuturesPositionDTO ) => {
  const res: FuturesPosition = (await Axios.post('/futures', props)).data
  return fromProps(res)
}



export const deletePosition = async (id: string) => {
  await Axios.delete(`/futures/${id}`)
}
export const getFuturesPosition = async (id: string) => {
  await Axios.get(`/futures/${id}`)
}

export const updateFuturesPosition = async (id: string, pos: Partial<Omit<CreateFuturesPositionDTO, "portfolioId">>) => {
  const res: FuturesPosition = (await Axios.patch(`/futures/${id}`, pos)).data
  return fromProps(res)
}

