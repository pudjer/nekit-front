import { Axios } from "@/api/Axios"
import { SpotPosition, CreateSpotPositionDTO } from "./SpotPosition"

export const fromProps = (props: SpotPosition) => {
  const portfolio = new SpotPosition(
    props.portfolioId,
    props._id,
    props.symbol,
    props.quantity,
    props.typestamp,
    props.initialPrice,
  )
  return portfolio
}

export const getPositionsByPortfolioId = async (portfolioId: string) => {
  const portfolios: SpotPosition[] = (await Axios.get(`/spot/${portfolioId}`)).data
  return portfolios.map(e=>fromProps(e))
}



export const createSpotPosition = async (props : CreateSpotPositionDTO ) => {
  const res: SpotPosition = (await Axios.post('/spot', props)).data
  return fromProps(res)
}



export const deletePosition = async (id: string) => {
  await Axios.delete(`/spot/${id}`)
}
export const getSpotPosition = async (id: string) => {
  await Axios.get(`/spot/${id}`)
}

export const updateSpotPosition = async (id: string, pos: Partial<Omit<CreateSpotPositionDTO, "portfolioId">>) => {
  const res: SpotPosition = (await Axios.patch(`/spot/${id}`, pos)).data
  return fromProps(res)
}
