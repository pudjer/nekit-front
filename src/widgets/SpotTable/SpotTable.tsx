import { observer } from 'mobx-react-lite';
import { StoreInstance } from '@/Store/Store';
import { PosTable, Column } from '../PosTable/PosTable';
import { useNavigate } from 'react-router-dom';
import { SpotPosition } from '@/Store/SpotPosition';
import { CommonColumns } from '../CommonColumns';


const initColumns: Column<SpotPosition>[] = CommonColumns

export const SpotTable: React.FC<{onSelect: (pos: SpotPosition)=>void}> = observer(({onSelect}) => {
  const nav = useNavigate()
  if(!StoreInstance.user?.portfolio?.spotPositions){
    if(!StoreInstance.isLoading)return ""
    nav("/portfolios")
    return ""
  }
  return <PosTable sx={{width: "100vw", height: "80vh"}}onSelect={onSelect} positions={StoreInstance.user.portfolio.spotPositions} cols={initColumns}/>
})
