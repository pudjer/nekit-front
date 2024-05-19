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
  const rate = StoreInstance.currency?.exchangeRateToUsd
  const [formData, setFormData] = useState<CreateSpotPositionDTO>({
    symbol: pos.symbol,
    quantity: pos.quantity,
    timestamp: pos.timestamp.slice(0, 16), // Initial timestamp as ISO string
    initialPrice: rate ? (pos.initialPrice * rate) : 0,
    exitPrice: rate && pos.exitPrice && (pos.exitPrice * rate),
    exitTimestamp: pos.exitTimestamp?.slice(0, 16)
  });
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: (value === "" ? null : value),

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
      <DialogTitle>Изменить спот-позицию</DialogTitle>
      <DialogContent>
        
        <CurrencySelect fullWidth onSelect={(c)=>{StoreInstance.currency = c}} value={StoreInstance.currency}/>
        <SymbolSelect init= {pos.symbol} fullWidth onChange={(s)=>s && setFormData({...formData, symbol: s.symbol, initialPrice: s.current_price * (StoreInstance.currency?.exchangeRateToUsd || 1)})}/>

        <TextField
          margin="dense"
          name="quantity"
          label="Количество"
          type="number"
          fullWidth
          value={formData.quantity || ""}
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
          value={formData.timestamp || ""}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="initialPrice"
          label="Начальная цена"
          type="number"
          fullWidth
          value={formData.initialPrice || ""}
          onChange={handleChange}
        />
         <TextField
          margin="dense"
          name="exitPrice"
          label="Цена закрытия"
          type="number"
          fullWidth
          value={formData.exitPrice || ""}
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
          value={formData.exitTimestamp || ""}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} color="primary">
          Изменить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

