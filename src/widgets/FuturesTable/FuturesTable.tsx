import { observer } from 'mobx-react-lite';
import { FuturesPosition } from '@/Store/FuturesPosition';
import { StoreInstance } from '@/Store/Store';
import { PosTable, Column } from '../PosTable/PosTable';
import { useNavigate } from 'react-router-dom';
import { CommonColumns } from '../CommonColumns';
import { Typography } from '@mui/material';


export const futuresColumns: Column<FuturesPosition>[]= [
  {
    id: 'type',
    label: 'Тип',
    format: (value: FuturesPosition) => value.quantity < 0 ? <div style={{color: "red"}}>SHORT</div> : <div style={{color: "lightgreen"}}>LONG</div>
  }, 
  {
    id: 'margin',
    label: 'Обеспечение',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.margin
      if(!price){
        return 'N/A'
      }
      const res = StoreInstance.convertFromUSD(price, value.currency)
      return [res[0].toLocaleString(), res[1]]

    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPriceChange() - b.getPriceChange()
  },

  ...CommonColumns,
  {
    id: 'stopLoss',
    label: 'Stop Loss',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.stopLoss
      if(!price){
        return 'N/A'
      }
      const res = StoreInstance.convertFromUSD(price, value.currency)
      return [res[0].toLocaleString(), res[1]]

    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPriceChange() - b.getPriceChange()
  },
  {
    id: 'takeProfit',
    label: 'Take Profit',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.takeProfit
      if(!price){
        return 'N/A'
      }
      const res = StoreInstance.convertFromUSD(price, value.currency)
      return [res[0].toLocaleString(), res[1]]
    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPriceChange() - b.getPriceChange()
  },

];


const hightlight = (value: FuturesPosition)=>{
  if(value.getValue()<0) return "darkred";
  if(value.takeProfit){
    if(value.quantity>0){
      if(value.getCurrentPrice()>=(value.takeProfit || NaN)){
        return "darkgreen"
      }
      if(value.getCurrentPrice()<=(value.stopLoss || NaN)){
        return "darkred"
      }
    }else{
      if(value.getCurrentPrice()<=(value.takeProfit || NaN)){
        return "darkgreen"
      }
      if(value.getCurrentPrice()>=(value.stopLoss || NaN)){
        return "darkred"
      }
    }
  }
    
}


export const FuturesTable: React.FC<{onSelect: (pos: FuturesPosition)=>void}> = observer(({onSelect}) => {
  const nav = useNavigate()
  if(!StoreInstance.user?.portfolio?.futuresPositions){
    if(!StoreInstance.isLoading)return ""
    nav("/portfolios")
    return ""
  }


  return <div style={{display: "flex", alignItems: "center",margin: 10, flexDirection: "column"}}>
    <Typography variant='h2'>Фючерс-позиции</Typography>
    <PosTable sx={{width: "97vw", height: "80vh"}} onSelect={onSelect} positions={StoreInstance.user.portfolio.futuresPositions} cols={futuresColumns}  highlighted={hightlight}/>
  </div>
})
