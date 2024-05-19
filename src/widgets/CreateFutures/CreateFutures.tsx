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
import { CreateFuturesPositionDTO } from '@/Store/FuturesPosition';


export const CreateFutures: React.FC<{open: boolean, onClose: ()=>void}> = ({open, onClose}) => {
  
  const [formData, setFormData] = useState<CreateFuturesPositionDTO>({
    symbol: "btc",
    quantity: 0,
    timestamp: (new Date()).toISOString().slice(0, 16), // Initial timestamp as ISO string
    initialPrice: 0,
    currency: StoreInstance.currency?.symbol || "USD",
    leverage: 1,
    margin: 0,
    initialCurrencyPrice: StoreInstance.currency ? 1 / StoreInstance.currency?.exchangeRateToUsd : 1

  });
  const [long, setIsLong] = useState(true)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;
    const changes: {[key: string]: any} = {}
    if(name==="leverage" && formData.margin){
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
    StoreInstance.portfolio?.createFuturesPosition(toModify)
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Добавить фьючерс-позицию</DialogTitle>
      <DialogContent>
        <CurrencySelect fullWidth onSelect={(s)=>s && setFormData({...formData, initialCurrencyPrice: 1/s.exchangeRateToUsd, currency: s.symbol})}/>
        <SymbolSelect fullWidth onChange={(s)=>s && setFormData({...formData, symbol: s.symbol, initialPrice: s.current_price * (StoreInstance.currency?.exchangeRateToUsd || 1)})}/>
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
          label="Начальная цена"
          type="number"
          fullWidth
          value={formData.initialPrice}
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
          InputLabelProps={{
            shrink: true,
          }}
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
        <TextField
          margin="dense"
          name="exitTimestamp"
          label="Время закрытия"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          value={formData.exitTimestamp}
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

