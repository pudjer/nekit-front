import { observer } from 'mobx-react-lite';
import { FuturesPosition } from '@/Store/FuturesPosition';
import { StoreInstance } from '@/Store/Store';
import { PosTable, Column } from '../PosTable/PosTable';
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
      return [price, " "+value.currency]

    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPriceChange() - b.getPriceChange()
  },

  { 
    id: 'symbol',
    label: 'Токен',
    format: (value: FuturesPosition) => <div style={{display: "flex", alignItems: "flex-end"}}><img style={{width: 40}} src={StoreInstance.tokensMap.get(value.symbol)?.image}/>{value.symbol}</div>,
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.symbol>b.symbol ? 1 : -1
  },
  { 
    id:'quantity',
    label: 'Количество',
    format: (value: FuturesPosition) => Math.abs(value.quantity).toLocaleString(),
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.quantity-b.quantity
  },
  {
    id: 'initialPrice',
    label: 'Начальная цена',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.initialPrice
      const res = [price, " "+value.currency]

      return [res[0].toLocaleString(), res[1]]
    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.initialPrice-b.initialPrice
  },
  {
    id: 'timestamp',
    label: 'Дата и время',
    align: 'right',
    format: (value: FuturesPosition) => (new Date(value.timestamp)).toLocaleString(),
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.timestamp>b.timestamp ? 1 : -1
  },
  {
    id: 'currentVolume',
    label: 'Текущий объем',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getValue()
      const res = [price, " "+value.currency]

      return [res[0].toLocaleString(), res[1]]

    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getValue() - b.getValue()
  },
  {
    id: 'initialVolume',
    label: 'Начальный объем',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getInitialValue()
      const res = [price, " "+value.currency]

      return [res[0].toLocaleString(), res[1]]

    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getInitialValue()-b.getInitialValue()
  },
  {
    id: 'currentPrice',
    label: 'Текущая цена',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getCurrentPrice()
      if(!price){
        return 'N/A'
      }
      const res = [price, " "+value.currency]

      return [res[0].toLocaleString(), res[1]]
    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getCurrentPrice()-b.getCurrentPrice()
  },
  {
    id: 'priceChange',
    label: 'Изменение цены',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getPriceChange()
      if(!price){
        return 'N/A'
      }
      return StoreInstance.formatChange(price, value.currency)

    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPriceChange() - b.getPriceChange()
  },
  {
    id: 'volumeChange',
    label: 'Прибыль',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getValueChange()
      if(!price){
        return 'N/A'
      }
      return StoreInstance.formatChange(price, value.currency)

    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPriceChangePerc() - b.getPriceChangePerc()

  },
  {
    id: 'changePerc',
    label: 'Прибыль %',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getValueChangePerc()
      return StoreInstance.formatChange(price, " %")
    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getValueChangePerc() - b.getValueChangePerc()

  },
  {
    id: 'portfolioPerc',
    label: 'Процент от ценности портфеля',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getPortfolioPerc()
      if(!price)return "N/A"
      return [price.toLocaleString(), " %"]
    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPortfolioPerc() - b.getPortfolioPerc()

  },
  {
    id: 'changePricePerc',
    label: 'Изменение цены %',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.getPriceChangePerc()
      if((!price || price === Infinity || price === -Infinity)){
        return 'N/A'
      }
      return StoreInstance.formatChange(price, " %")
    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPriceChangePerc() - b.getPriceChangePerc()

  },
  {
    id: 'stopLoss',
    label: 'Stop Loss',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.stopLoss
      if(!price){
        return 'N/A'
      }
      return [price.toLocaleString(), value.currency]

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
      return [price.toLocaleString(), value.currency]
    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => a.getPriceChange() - b.getPriceChange()
  },
  {
    id: 'exitPrice',
    label: 'Цена закрытия',
    align: 'right',
    format: (value: FuturesPosition) => {
      const price = value.exitPrice
      if(!price)return "N/A"
      const res = [price, " "+value.currency]
      return [res[0].toLocaleString(), res[1]]
    },
    toCompare: (a: FuturesPosition, b: FuturesPosition) => {
      if(!a.exitPrice || !b.exitPrice)return 0
      return a.exitPrice-b.exitPrice
    }
  },
  {
    id: 'exitTimestamp',
    label: 'Время закрытия',
    align: 'right',
    format: (value: FuturesPosition) => (new Date(value.timestamp)).toLocaleString(),
    toCompare: (a: FuturesPosition, b: FuturesPosition) => {
      if(!a.timestamp || !b.timestamp)return 0
      return a.timestamp>b.timestamp ? 1 : -1
    }
  }

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
