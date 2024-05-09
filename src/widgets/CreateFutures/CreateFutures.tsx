import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { StoreInstance } from '@/Store/Store';
import { SymbolSelect } from '../SymbolSelect/SymbolSelect';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';
import { CreateFuturesPositionDTO } from '@/Store/FuturesPosition';


export const CreateFutures: React.FC<{open: boolean, onClose: ()=>void}> = ({open, onClose}) => {
  const [formData, setFormData] = useState<CreateFuturesPositionDTO>({
    symbol: '',
    quantity: 0,
    timestamp: (new Date()).toISOString().slice(0, 16), // Initial timestamp as ISO string
    initialPrice: 0,
    currency: "",
    leverage: 1,
    margin: 0,
    stopLoss: 0,
    takeProfit: 0
  });
  
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
    const initialPrice = formData.initialPrice / StoreInstance.currency!.exchangeRateToUsd
    StoreInstance.user?.portfolio?.createFuturesPosition({...formData, initialPrice})
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Futures Position</DialogTitle>
      <DialogContent>
        <CurrencySelect fullWidth/>
        <SymbolSelect fullWidth onChange={(s)=>s && setFormData({...formData, symbol: s.symbol})}/>
        <TextField
          margin="dense"
          name="quantity"
          label="Quantity"
          type="number"
          fullWidth
          value={formData.quantity}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="timestamp"
          label="timestamp"
          type="datetime-local"
          fullWidth
          value={formData.timestamp}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="initialPrice"
          label="Initial Price"
          type="number"
          fullWidth
          value={formData.initialPrice}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="leverage"
          label="Leverage"
          type="number"
          fullWidth
          value={formData.leverage}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="margin"
          label="Margin"
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

