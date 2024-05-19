import { StoreInstance } from "@/Store/Store";
import { Axios } from "@/api/Axios";
import { TextField } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
export const Chart: React.FC<{symbol: string, curr?:string, valueFn: (price: number)=>number, since?: string, until?: string}> = observer(({symbol, curr, since, until, valueFn = ((price: number)=>price)})=>{
  const currency = curr || StoreInstance.currency?.symbol || "USD"
  const [untilS, setUntil] = useState(until);
  const [sinceS, setSince] = useState(since)

  
  let [marks, setMarks] = useState<CurrencyMark[]>()

  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  useEffect(()=>{
    Axios.get("exchange/marks", {params: {since: sinceS || yesterday.toISOString(), until: untilS || (new Date()).toISOString()}}).then((r)=>{
      setMarks(r.data)
    })
  },[untilS, sinceS])
  if(!marks)return<div>Loading...</div>
  marks = marks.sort((a, b)=>(new Date(a.timestamp)).getTime() - (new Date(b.timestamp)).getTime())
  const x = marks.map(e=>(new Date(e.timestamp)))
  const y = marks.map(e=>{
    const tokenP = e.tokens && e.tokens[symbol]
    const currP = e.currencies && e.currencies[currency]
    if(!tokenP || !currP)return null
    return valueFn(currP * tokenP)
  })

  return (<div style={{display: "flex"}}>
            <LineChart
              xAxis={[{ data: x, valueFormatter: (date: Date) => (new Date(date)).toLocaleString(),  }]}
              series={[
                {
                  data: y,
                },
              ]}
              height={300}
              margin={{ left: 100, right: 30, top: 30, bottom: 30 }}
            />
            <div>
              <TextField
                margin="dense"
                name="timestamp"
                label="ОТ"
                InputLabelProps={{
                  shrink: true,
                }}
        
                type="datetime-local"
                value={sinceS}
                onChange={(e)=>{
                  if(since && (new Date(e.target.value))<(new Date(since))) return
                  setSince(e.target.value)
                }}
              />
              <TextField
                margin="dense"
                name="timestamp"
                label="ДО"
                InputLabelProps={{
                  shrink: true,
                }}
                type="datetime-local"
                value={untilS}
                onChange={(e)=>{
                  if(until && (new Date(e.target.value))>(new Date(until))) return
                  setUntil(e.target.value)
                }}
              />
            </div>
          </div>
  )
})

export interface CurrencyMark {
  timestamp: string;
  currencies: {[key: string]: number};
  tokens: {[key: string]: number};
}