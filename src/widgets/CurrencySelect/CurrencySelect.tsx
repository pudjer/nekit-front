import { Currency } from "@/Store/Currency";
import { StoreInstance } from "@/Store/Store"
import { FormControl, TextField, Autocomplete } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useState } from "react";

export const CurrencySelect : React.FC<{fullWidth?: boolean, onSelect?: (cur: Currency)=>void, init?: string, value?: Currency}> = observer(({fullWidth, onSelect = ()=>undefined, init, value}) => {
  const [cur, setCur] = useState<Currency | undefined>(StoreInstance.currencyMap.get(init || ""))
  const [isCorrect, setIsCorrect] = useState(true);
  const options = StoreInstance.currencies.map((curr) => 
    ({
      label: curr.symbol+" "+curr.name,
      id: curr
    }))


  const val = value ? {
    label: value.symbol+" "+value.name,
    id: value
  }: cur ? {
    label: cur.symbol+" "+cur.name,
    id: cur
  }: ""
  return (
    <FormControl variant='standard' fullWidth style={fullWidth ? {} : {width: "200px"}}>
      <Autocomplete

        fullWidth={fullWidth}
        freeSolo
        options={options}
        value={val}
        renderInput={(params) => <TextField {...params} label={isCorrect ? "Валюта" : "Выберите валюту!!"} />}
        onChange={(_, v)=>{
          if(typeof v !== "string" && v){
            setIsCorrect(true)
            const currency = v.id
            onSelect(currency)
            if(!value)setCur(v.id)
          }else{
            setIsCorrect(false)
          }
        }}
      />
    </FormControl>
  );
});