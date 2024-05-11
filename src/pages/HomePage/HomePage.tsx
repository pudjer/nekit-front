import { Column } from "@/widgets/PosTable/PosTable"
import { observer } from "mobx-react-lite"
import { PosTable } from "@/widgets/PosTable/PosTable"
import { StoreInstance } from "@/Store/Store"
import { Token } from "@/Store/Token"
type TokenWithId = Token & {_id: string}
const cols: Column<TokenWithId>[] = [
  { 
    id: 'symbol',
    label: 'symbol',
    format: (value: TokenWithId) => <div style={{display: "flex", alignItems: "flex-end"}}><img style={{width: 40}} src={value.image}/>{value.symbol}</div>
  },
  {
    id: 'currentPrice',
    label: 'currentPrice',
    align: 'right',
    format: (value: TokenWithId) => {
      const price = value.current_price
      const res = StoreInstance.convertFromUSD(price)
      return [res[0].toLocaleString(), res[1]]
    },
  },
  {
    id: 'priceChange24',
    label: 'priceChange24',
    align: 'right',
    format: (value: TokenWithId) => {
      const price = value.price_change_24h
      if(!price){
        return 'N/A'
      }
      return StoreInstance.formatChange(...StoreInstance.convertFromUSD(price))

    },
  },
  {
    id: 'changePerc24',
    label: 'changePerc24',
    align: 'right',
    format: (value: TokenWithId) => {
      const price = value.price_change_percentage_24h
      return StoreInstance.formatChange(price, " %")
    },
  },

]
export const HomePage = observer(()=>{
  const tokens: TokenWithId[] = StoreInstance.tokens.map(token=>({...token, _id: token.symbol}))
  return <PosTable sx={{width: "100vw"}} cols={cols} positions={tokens} onSelect={()=>undefined}/>
})