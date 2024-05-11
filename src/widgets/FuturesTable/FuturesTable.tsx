import { observer } from 'mobx-react-lite';
import { FuturesPosition } from '@/Store/FuturesPosition';
import { StoreInstance } from '@/Store/Store';
import { PosTable, Column } from '../PosTable/PosTable';
import { useNavigate } from 'react-router-dom';
import { CommonColumns } from '../CommonColumns';
import { Typography } from '@mui/material';


export const futuresColumns: Column<FuturesPosition>[]= [
  {
    id: 'type',
    label: 'type',
    format: (value: FuturesPosition) => value.quantity < 0 ? <div style={{color: "red"}}>SHORT</div> : <div style={{color: "lightgreen"}}>LONG</div>
  }, 
  ...CommonColumns

];


const hightlight = (value: FuturesPosition)=>{
  if(value.getValue()<0) return "darkred";
  if(value.takeProfit){
    if(value.quantity>0){
      if(value.getCurrentPrice()>=value.takeProfit){
        return "darkgreen"
      }
    }else{
      if(value.getCurrentPrice()<=value.takeProfit){
        return "darkgreen"
      }
    }
  }
    
}
export const FuturesTable: React.FC<{onSelect: (pos: FuturesPosition)=>void}> = observer(({onSelect}) => {
  const nav = useNavigate()
  if(!StoreInstance.user?.portfolio?.futuresPositions){
    if(!StoreInstance.isLoading)return ""
    nav("/portfolios")
    return ""
  }
  return <div style={{display: "flex", alignItems: "center",margin: 10, flexDirection: "column"}}>
    <Typography variant='h2'>Futures</Typography>
    <PosTable sx={{width: "97vw", height: "80vh"}} onSelect={onSelect} positions={StoreInstance.user.portfolio.futuresPositions} cols={futuresColumns}  highlighted={hightlight}/>
  </div>
})
