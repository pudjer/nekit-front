import { Position } from "@/Store/PositionInterface"
import { Column } from "./PosTable/PosTable"
import { StoreInstance } from "@/Store/Store";

export const CommonColumns: Column<Position>[] = [
  { 
    id: 'symbol',
    label: 'Токен',
    format: (value: Position) => <div style={{display: "flex", alignItems: "flex-end"}}><img style={{width: 40}} src={StoreInstance.tokensMap.get(value.symbol)?.image}/>{value.symbol}</div>,
    toCompare: (a: Position, b: Position) => a.symbol>b.symbol ? 1 : -1
  },
  { 
    id:'quantity',
    label: 'Количество',
    format: (value: Position) => Math.abs(value.quantity).toLocaleString(),
    toCompare: (a: Position, b: Position) => a.quantity-b.quantity
  },
  {
    id: 'initialPrice',
    label: 'Начальная цена',
    align: 'right',
    format: (value: Position) => {
      const price = value.initialPrice
      const res = StoreInstance.convertFromUSD(price, value.currency)
      return [res[0].toLocaleString(), res[1]]
    },
    toCompare: (a: Position, b: Position) => a.initialPrice-b.initialPrice
  },
  {
    id: 'timestamp',
    label: 'Дата и время',
    align: 'right',
    format: (value: Position) => (new Date(value.timestamp)).toLocaleString(),
    toCompare: (a: Position, b: Position) => a.timestamp>b.timestamp ? 1 : -1
  },
  {
    id: 'currentVolume',
    label: 'Текущая ценность',
    align: 'right',
    format: (value: Position) => {
      const price = value.getValue()
      const res = StoreInstance.convertFromUSD(price, value.currency)

      return [res[0].toLocaleString(), res[1]]

    },
    toCompare: (a: Position, b: Position) => a.getValue() - b.getValue()
  },
  {
    id: 'initialVolume',
    label: 'Начальная ценность',
    align: 'right',
    format: (value: Position) => {
      const price = value.getInitialValue()
      const res = StoreInstance.convertFromUSD(price, value.currency)

      return [res[0].toLocaleString(), res[1]]

    },
    toCompare: (a: Position, b: Position) => a.getInitialValue()-b.getInitialValue()
  },
  {
    id: 'currentPrice',
    label: 'Текущая цена',
    align: 'right',
    format: (value: Position) => {
      const price = value.getCurrentPrice()
      if(!price){
        return 'N/A'
      }
      const res = StoreInstance.convertFromUSD(price, value.currency)

      return [res[0].toLocaleString(), res[1]]
    },
    toCompare: (a: Position, b: Position) => a.getCurrentPrice()-b.getCurrentPrice()
  },
  {
    id: 'priceChange',
    label: 'Изменение цены',
    align: 'right',
    format: (value: Position) => {
      const price = value.getPriceChange()
      if(!price){
        return 'N/A'
      }
      return StoreInstance.formatChange(...StoreInstance.convertFromUSD(price, value.currency)
    )

    },
    toCompare: (a: Position, b: Position) => a.getPriceChange() - b.getPriceChange()
  },
  {
    id: 'volumeChange',
    label: 'Изменение ценности',
    align: 'right',
    format: (value: Position) => {
      const price = value.getValueChange()
      if(!price){
        return 'N/A'
      }
      return StoreInstance.formatChange(...StoreInstance.convertFromUSD(price, value.currency))

    },
    toCompare: (a: Position, b: Position) => a.getPriceChangePerc() - b.getPriceChangePerc()

  },
  {
    id: 'changePerc',
    label: 'Изменение ценности %',
    align: 'right',
    format: (value: Position) => {
      const price = value.getValueChangePerc()
      return StoreInstance.formatChange(price, " %")
    },
    toCompare: (a: Position, b: Position) => a.getValueChangePerc() - b.getValueChangePerc()

  },
  {
    id: 'portfolioPerc',
    label: 'Процент от ценности портфеля',
    align: 'right',
    format: (value: Position) => {
      const price = value.getPortfolioPerc()
      return StoreInstance.formatChange(price, " %")
    },
    toCompare: (a: Position, b: Position) => a.getPortfolioPerc() - b.getPortfolioPerc()

  },
  {
    id: 'changePricePerc',
    label: 'Изменение цены %',
    align: 'right',
    format: (value: Position) => {
      const price = value.getPriceChangePerc()
      if((!price || price === Infinity || price === -Infinity)){
        return 'N/A'
      }
      return StoreInstance.formatChange(price, " %")
    },
    toCompare: (a: Position, b: Position) => a.getPriceChangePerc() - b.getPriceChangePerc()

  },

];