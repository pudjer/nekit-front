import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { CreateSpotPositionDTO, SpotPosition } from '@/Store/SpotPosition';
import { StoreInstance } from '@/Store/Store';
import { SymbolSelect } from '../SymbolSelect/SymbolSelect';
import { CurrencySelect } from '../CurrencySelect/CurrencySelect';


export const UpdateSpot: React.FC<{open: boolean, onClose: ()=>void, pos: SpotPosition}> = ({open, onClose,pos}) => {
  const [formData, setFormData] = useState<CreateSpotPositionDTO>({
    symbol: pos.symbol,
    quantity: pos.quantity,
    timestamp: pos.timestamp.slice(0, 16), // Initial timestamp as ISO string
    initialPrice: pos.initialPrice,
    exitPrice: pos.exitPrice
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
    const keysToUsd = ['initialPrice', 'exitPrice'] satisfies (keyof SpotPosition)[]
    
    const toUsd = {...formData}
    for(const key of keysToUsd){
      if(toUsd[key]!==undefined){
        toUsd[key] = toUsd[key]! / StoreInstance.currency.exchangeRateToUsd
      }
    }
    pos.update(toUsd)
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Spot Position</DialogTitle>
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
          name="exitPrice"
          label="Exit Price"
          type="number"
          fullWidth
          value={formData.exitPrice}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

