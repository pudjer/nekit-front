import { StoreInstance } from "@/Store/Store";
import { Token } from "@/Store/Token";
import { FormControl, Autocomplete, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export const SymbolSelect: React.FC<{onChange: (token: Token | undefined)=>void, fullWidth?: boolean, init?: string}> = observer(({onChange, fullWidth, init}) => {
  const [isCorrect, setIsCorrect] = useState(true);

  const options = StoreInstance.tokens.map((curr) => 
    ({
      label: curr.symbol+" "+curr.name,
      id: curr
    }))
  const [value, setValue] = useState<string | null | typeof options[number]>(init && options.find(e=>e.id.symbol === init) || "" );

  return (
    <FormControl variant='standard' fullWidth={fullWidth}>
      <Autocomplete
        freeSolo
        options={
          options
        }
        renderInput={(params) => <TextField {...params} label={isCorrect ? "Token" : "Select Token!!"} />}
        value={value}
        onChange={(e, v)=>{
          setValue(v)
          if(typeof v !== "string" && v){
            setIsCorrect(true)
            onChange(v.id)
          }else{
            setIsCorrect(false)
            onChange(undefined)
          }
        }}
      />
    </FormControl>
  );
});