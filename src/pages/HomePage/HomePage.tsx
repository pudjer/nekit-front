import { Column } from "@/widgets/PosTable/PosTable"
import { observer } from "mobx-react-lite"
import { PosTable } from "@/widgets/PosTable/PosTable"
import { StoreInstance } from "@/Store/Store"
import { Token } from "@/Store/Token"
import { Card, CardContent, Typography } from "@mui/material"
type TokenWithId = Token & {_id: string}
const cols: Column<TokenWithId>[] = [
  { 
    id: 'symbol',
    label: 'symbol',
    format: (value: TokenWithId) => <div style={{display: "flex", alignItems: "flex-end"}}><img style={{width: 40}} src={value.image}/>{value.symbol}</div>,
    toCompare: (a: TokenWithId, b: TokenWithId) => a.symbol > b.symbol ? 1 : -1

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
    toCompare: (a: TokenWithId, b: TokenWithId) => a.current_price - b.current_price
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
    toCompare: (a: TokenWithId, b: TokenWithId) => a.price_change_24h - b.price_change_24h

  },
  {
    id: 'changePerc24',
    label: 'changePerc24',
    align: 'right',
    format: (value: TokenWithId) => {
      const price = value.price_change_percentage_24h
      return StoreInstance.formatChange(price, " %")
    },
    toCompare: (a: TokenWithId, b: TokenWithId) => a.price_change_percentage_24h - b.price_change_percentage_24h

  },

]
export const HomePage = observer(()=>{
  const tokens: TokenWithId[] = StoreInstance.tokens.map(token=>({...token, _id: token.symbol}))
  return  <div style={{display: "flex", alignItems: "center",margin: 10, flexDirection: "column"}}>
            {StoreInstance.global &&

              <div style={{display:"flex", flexGrow: 2, flexWrap: 'wrap', justifyContent: "space-around", padding: 20, width: "100%"}}>
                <Card style={{flexGrow: 2, margin: 5}} >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Доминация Bitcoin
                    </Typography>
                    <Typography variant="h4">
                      {StoreInstance.global?.btc_dominance.toLocaleString() + " %"}
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{flexGrow: 2, margin: 5}} >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Доминация Ethereum
                    </Typography>
                    <Typography variant="h4">
                      {StoreInstance.global?.eth_dominance.toLocaleString() + " %"}
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{flexGrow: 2, margin: 5}} >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Общая рыночная капитализация криптовалюты
                    </Typography>
                    <Typography variant="h4">
                      {StoreInstance.convertFromUSD(StoreInstance.global?.total_market_cap)}
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{flexGrow: 2, margin: 5}} >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Объем торгов криптовалют за 24 часа
                    </Typography>
                    <Typography variant="h4">
                      {StoreInstance.convertFromUSD(StoreInstance.global?.total_volume_24h)}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            }
    <Typography variant='h2'>Список криптовалют</Typography>

    <PosTable sx={{width: "98vw"}} cols={cols} positions={tokens} onSelect={()=>undefined}/>
  </div>

})