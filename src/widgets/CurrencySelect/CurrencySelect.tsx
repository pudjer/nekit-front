import { Currency } from "@/Store/Currency";
import { StoreInstance } from "@/Store/Store"
import { FormControl, TextField, Autocomplete } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useState } from "react";

export const CurrencySelect : React.FC<{fullWidth?: boolean}> = observer(({fullWidth}) => {
  const [isCorrect, setIsCorrect] = useState(true);
  const options = StoreInstance.currencies.map((curr) => 
    ({
      label: curr.symbol+" "+curr.name,
      id: curr
    }))
  return (
    <FormControl variant='standard' fullWidth style={fullWidth ? {} : {width: "200px"} }>
      <Autocomplete
        fullWidth={fullWidth}
        freeSolo
        options={options}
        value={StoreInstance.currency ? {
          label: StoreInstance.currency.symbol+" "+StoreInstance.currency.name,
          id: StoreInstance.currency
        }: ""}
        renderInput={(params) => <TextField {...params} label={isCorrect ? "Currency" : "Select Currency!!"} />}
        onChange={(e, v)=>{
          if(typeof v !== "string" && v){
            setIsCorrect(true)
            const currency = v.id
            StoreInstance.currency = currency
          }else{
            setIsCorrect(false)
          }
        }}
      />
    </FormControl>
  );
});