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
  if(value.getValue()<=0) return "#200808";
  if(value.takeProfit){
    if(value.quantity>0){
      if(value.getCurrentPrice()>=(value.takeProfit || NaN)){
        return "#081b07"
      }
      if(value.getCurrentPrice()<=(value.stopLoss || NaN)){
        return "#200808"
      }
    }else{
      if(value.getCurrentPrice()<=(value.takeProfit || NaN)){
        return "#081b07"
      }
      if(value.getCurrentPrice()>=(value.stopLoss || NaN)){
        return "#200808"
      }
    }
  }
    
}


export const FuturesTable: React.FC<{onSelect: (pos: FuturesPosition)=>void}> = observer(({onSelect}) => {

  return <div style={{display: "flex", alignItems: "center",margin: 10, flexDirection: "column"}}>
    <Typography variant='h2'>Фючерс-позиции</Typography>
    <PosTable sx={{width: "97vw", height: "80vh"}} onSelect={onSelect} positions={StoreInstance.portfolio?.futuresPositions || []} cols={futuresColumns}  highlighted={hightlight}/>
  </div>
})
