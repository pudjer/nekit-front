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
import { StoreInstance } from '@/Store/Store';
import { SymbolSelect } from '../SymbolSelect/SymbolSelect';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';
import { CreateFuturesPositionDTO, FuturesPosition } from '@/Store/FuturesPosition';


export const CreateFutures: React.FC<{open: boolean, onClose: ()=>void}> = ({open, onClose}) => {
  const [formData, setFormData] = useState<Partial<CreateFuturesPositionDTO>>({
    timestamp: (new Date()).toISOString().slice(0, 16), // Initial timestamp as ISO string
    initialPrice: 0,
    currency: "",
    leverage: 1,
    margin: 0,
    stopLoss: 0,
    takeProfit: 0
  });
  const [long, setIsLong] = useState(true)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: (value),
    });

  };

  const handleSubmit = () => {
    if(!StoreInstance.currency){
      alert("select currency!!!")
      return
    }
    const keysToUsd = ['initialPrice', 'margin', 'stopLoss', 'takeProfit', 'exitPrice'] satisfies (keyof FuturesPosition)[]

    
    const toUsd = {...formData}
    for(const key of keysToUsd){
      if(toUsd[key]!==undefined){
        toUsd[key] = toUsd[key]! / StoreInstance.currency.exchangeRateToUsd
      }
    }
    if(!long && toUsd.quantity)toUsd.quantity = -toUsd.quantity
    toUsd.currency = StoreInstance.currency.symbol
    //@ts-ignore
    StoreInstance.user?.portfolio?.createFuturesPosition(toUsd)
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Добавить фьючерс-позицию</DialogTitle>
      <DialogContent>
        <CurrencySelect fullWidth/>
        <SymbolSelect fullWidth onChange={(s)=>s && setFormData({...formData, symbol: s.symbol})}/>
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
          name="initialPrice"
          label="Цена покупки"
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
          name="timestamp"
          label="Дата и время"
          type="datetime-local"
          fullWidth
          value={formData.timestamp}
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

      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
           Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

