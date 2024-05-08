import { StoreInstance } from "@/models/Store"
import { FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useRef, useState } from "react";

export const CurrencySelect = observer(() => {
  const [search, Query] = useState('');
  const ref = useRef<HTMLInputElement>(null)
  console.log(search)


  return (
    <FormControl variant='standard' style={{width: "10%"}}>
      <InputLabel>Currency</InputLabel>
      <TextField style={{overflow: "hidden"} }
        value={ StoreInstance.currency?.symbol || ''}
        label="Currency"
      >
        {StoreInstance.currencies.map((currency) => (
          <MenuItem key={currency.symbol} value={currency.symbol+": "+currency.name} style={{maxWidth: "50vw"}} onClick={()=>{StoreInstance.currency = currency}}>
            {currency.name}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
});