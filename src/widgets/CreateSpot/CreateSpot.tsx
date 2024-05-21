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


export const CreateSpot: React.FC<{open: boolean, onClose: ()=>void}> = ({open, onClose}) => {
  const rate = StoreInstance.currency?.exchangeRateToUsd
  const price = StoreInstance.tokensMap.get("btc")?.current_price
  const [formData, setFormData] = useState<CreateSpotPositionDTO>({
    quantity:0,
    symbol:"btc",
    timestamp: (new Date()).toISOString().slice(0, 16), // Initial timestamp as ISO string
    initialPrice: (rate && price && price * rate) || 0,
    exitTimestamp: "", // Initial timestamp as ISO string,

  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,

    });
  };

  const handleSubmit = () => {
    if(!StoreInstance.currency){
      alert("select currency!!!")
      return
    }
    const keysToUsd = ['initialPrice', 'exitPrice'] satisfies (keyof SpotPosition)[]
    console.log(formData)
    const toUsd = {...formData}
    for(const key of keysToUsd){
      if(toUsd[key]!==undefined){
        toUsd[key] = toUsd[key]! / StoreInstance.currency.exchangeRateToUsd
      }
    }

    const toModify = {...toUsd}
    for(const key in toModify){
      if(toModify[key]===''){
        delete toModify[key]
      }
    }
    //@ts-ignore
    StoreInstance.portfolio?.createSpotPosition(toModify)

  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Добавить спот-позицию</DialogTitle>
      <DialogContent>
        <CurrencySelect fullWidth onSelect={(c)=>{StoreInstance.currency = c}} value={StoreInstance.currency}/>
        <SymbolSelect init='btc' fullWidth onChange={(s)=>s && setFormData({...formData, symbol: s.symbol, initialPrice: s.current_price * (StoreInstance.currency?.exchangeRateToUsd || 1)})}/>

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
          ДОБАВИТЬ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

