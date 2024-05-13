import { observer } from 'mobx-react-lite';
import { StoreInstance } from '@/Store/Store';
import { PosTable, Column } from '../PosTable/PosTable';
import { useNavigate } from 'react-router-dom';
import { SpotPosition } from '@/Store/SpotPosition';
import { CommonColumns } from '../CommonColumns';
import { Typography } from '@mui/material';


export const spotColumns: Column<SpotPosition>[] = CommonColumns

export const SpotTable: React.FC<{onSelect: (pos: SpotPosition)=>void}> = observer(({onSelect}) => {
  const nav = useNavigate()
  if(!StoreInstance.user?.portfolio?.spotPositions){
    if(!StoreInstance.isLoading)return ""
    nav("/portfolios")
    return ""
  }
  return <div style={{display: "flex", alignItems: "center",margin: 10, flexDirection: "column"}}>
    <Typography variant='h2'>Спот-позиции</Typography>
    <PosTable sx={{width: "97vw", height: "80vh"}}onSelect={onSelect} positions={StoreInstance.user.portfolio.spotPositions} cols={spotColumns}/>
  </div>
})
