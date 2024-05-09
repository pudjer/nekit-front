import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { CreateFuturesPositionDTO, FuturesPosition } from '@/Store/FuturesPosition';
import { StoreInstance } from '@/Store/Store';
import { SymbolSelect } from '../SymbolSelect/SymbolSelect';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';


export const UpdateFutures: React.FC<{open: boolean, onClose: ()=>void, pos: FuturesPosition}> = ({open, onClose,pos}) => {
  const [formData, setFormData] = useState<CreateFuturesPositionDTO>({
    symbol: pos.symbol,
    quantity: pos.quantity,
    timestamp: pos.timestamp.slice(0, 16), // Initial timestamp as ISO string
    initialPrice: pos.initialPrice,
    currency: pos.currency,
    leverage: pos.leverage,
    margin: pos.margin,
    stopLoss: pos.stopLoss,
    takeProfit: pos.takeProfit
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
    pos.update({...formData, initialPrice})
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Futures Position</DialogTitle>
      <DialogContent>
        <CurrencySelect fullWidth/>
        <SymbolSelect init={pos.symbol} fullWidth onChange={(s)=>s && setFormData({...formData, symbol: s.symbol})}/>
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

