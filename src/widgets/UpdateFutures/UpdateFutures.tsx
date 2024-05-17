import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import { CreateFuturesPositionDTO, FuturesPosition } from '@/Store/FuturesPosition';
import { StoreInstance } from '@/Store/Store';
import { SymbolSelect } from '../SymbolSelect/SymbolSelect';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';


export const UpdateFutures: React.FC<{open: boolean, onClose: ()=>void, pos: FuturesPosition}> = ({open, onClose,pos}) => {
  StoreInstance.currency = StoreInstance.currencies.find(e=>e.symbol===pos.currency)
  const [formData, setFormData] = useState<CreateFuturesPositionDTO>({
    symbol: pos.symbol,
    quantity: Math.abs(pos.quantity),
    timestamp: pos.timestamp.slice(0, 16), // Initial timestamp as ISO string
    initialPrice: StoreInstance.convertFromUSD(pos.initialPrice, pos.currency)[0],
    currency: pos.currency,
    leverage: pos.leverage,
    margin: StoreInstance.convertFromUSD(pos.margin, pos.currency)[0],
    stopLoss: StoreInstance.convertFromUSD(pos.stopLoss, pos.currency)[0] || undefined,
    takeProfit: StoreInstance.convertFromUSD(pos.takeProfit, pos.currency)[0] || undefined,
    exitPrice: StoreInstance.convertFromUSD(pos.exitPrice, pos.currency)[0] || undefined,
    initialCurrencyPrice: pos.initialCurrencyPrice
  });
  const [long, setIsLong] = useState(true)
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    const changes: {[key: string]: any} = {}
    if(name==="leverage"){
      changes.quantity = formData.margin * Number(value)
    }

    setFormData({
      ...formData,
      [name]: (value === "" ? undefined : value),

      ...changes
    });
  };
  const handleSubmit = () => {
    if(!StoreInstance.currency){
      alert("select currency!!!")
      return
    }
    const toModify = {...formData}
    if(!long && toModify.quantity)toModify.quantity = -toModify.quantity
    toModify.currency = StoreInstance.currency.symbol
    pos.update(toModify)
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Изменить фьючерс-позицию</DialogTitle>
      <DialogContent>
        <CurrencySelect fullWidth/>
        <SymbolSelect init={pos.symbol} fullWidth onChange={(s)=>s && setFormData({...formData, symbol: s.symbol})}/>
        <FormControlLabel control={<Switch style={{color: long ? "lightgreen" : "red"}} checked={long} onChange={()=>setIsLong(!long)}/>} label={long ? "LONG" : "SHORT"} />

        <TextField
          margin="dense"
          name="quantity"
          label="Количество"
          type="number"
          fullWidth
          value={formData.quantity}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="timestamp"
          label="Время открытия"
          type="datetime-local"
          fullWidth
          value={formData.timestamp}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="initialPrice"
          label="Начальная цена"
          type="number"
          fullWidth
          value={formData.initialPrice}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="leverage"
          label="Кредитное плечо"
          type="number"
          fullWidth
          value={formData.leverage}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="margin"
          label="Обеспечение"
          type="number"
          fullWidth
          value={formData.margin}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="stopLoss"
          label="Stop Loss"
          type="number"
          fullWidth
          value={formData.stopLoss}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="takeProfit"
          label="Take Profit"
          type="number"
          fullWidth
          value={formData.takeProfit}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="exitPrice"
          label="Цена закрытия"
          type="number"
          fullWidth
          value={formData.exitPrice}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="initialCurrencyPrice"
          label="Начальная цена валюты к USD"
          type="number"
          fullWidth
          value={formData.initialCurrencyPrice}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="exitTimestamp"
          label="Время закрытия"
          type="datetime-local"
          fullWidth
          value={formData.exitTimestamp}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          ИЗМЕНИТЬ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

