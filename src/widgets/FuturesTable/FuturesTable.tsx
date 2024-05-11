import { observer } from 'mobx-react-lite';
import { FuturesPosition } from '@/Store/FuturesPosition';
import { StoreInstance } from '@/Store/Store';
import { PosTable, Column } from '../PosTable/PosTable';
import { useNavigate } from 'react-router-dom';
import { CommonColumns } from '../CommonColumns';


const initColumns: Column<FuturesPosition>[]= [
  {
    id: 'type',
    label: 'type',
    format: (value: FuturesPosition) => value.quantity < 0 ? <div style={{color: "red"}}>SHORT</div> : <div style={{color: "lightgreen"}}>LONG</div>
  }, 
  ...CommonColumns

];

export const FuturesTable: React.FC<{onSelect: (pos: FuturesPosition)=>void}> = observer(({onSelect}) => {
  const nav = useNavigate()
  if(!StoreInstance.user?.portfolio?.futuresPositions){
    if(!StoreInstance.isLoading)return ""
    nav("/portfolios")
    return ""
  }
  return <PosTable sx={{width: "100vw", height: "80vh"}} onSelect={onSelect} positions={StoreInstance.user.portfolio.futuresPositions} cols={initColumns}/>
})
