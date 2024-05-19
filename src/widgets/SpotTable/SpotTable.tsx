import { observer } from 'mobx-react-lite';
import { StoreInstance } from '@/Store/Store';
import { PosTable, Column } from '../PosTable/PosTable';
import { SpotPosition } from '@/Store/SpotPosition';
import { CommonColumns } from '../CommonColumns';
import { Typography } from '@mui/material';


export const spotColumns: Column<SpotPosition>[] = CommonColumns

export const SpotTable: React.FC<{onSelect: (pos: SpotPosition)=>void}> = observer(({onSelect}) => {
  return <div style={{display: "flex", alignItems: "center",margin: 10, flexDirection: "column"}}>
    <Typography variant='h2'>Спот-позиции</Typography>
    <PosTable sx={{width: "97vw", height: "80vh"}} onSelect={onSelect} positions={StoreInstance.portfolio?.spotPositions || []} cols={spotColumns}/>
  </div>
})
