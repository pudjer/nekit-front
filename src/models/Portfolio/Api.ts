import { Axios } from "../../api/Axios"
import { Portfolio } from "./Portfolio"

export const fromProps = (props: Portfolio) => {
  const portfolio = new Portfolio(props._id, props.userId, props.description, props.name)
  return portfolio
}

export const getPortfolios = async () => {
  const portfolios: Portfolio[] = (await Axios.get('/portfolios')).data
  return portfolios.map(e=>fromProps(e))
}


export type createPortfolioDTO = {
  currency?: string
  description?: string
  name: string
}
export const createPortfolio = async (props : createPortfolioDTO ) => {
  const res: Portfolio = (await Axios.post('/portfolios', props)).data
  return fromProps(res)
}



export const deletePortfolio = async (id: string) => {
  await Axios.delete(`/portfolio/${id}`)
}
export const getPortfolio = async (id: string) => {
  await Axios.get(`/portfolio/${id}`)
}

export const updatePortfolio = async (id: string, portfolio: Partial<createPortfolioDTO>) => {
  const res: Portfolio = (await Axios.patch(`/portfolio/${id}`, portfolio)).data
  return fromProps(res)
}

