import { SpotPosition } from "@/Store/SpotPosition";
import { StoreInstance } from "@/Store/Store";
import { CreateSpot } from "@/widgets/CreateSpot/CreateSpot";
import { SpotTable } from "@/widgets/SpotTable/SpotTable";
import { UpdateSpot } from "@/widgets/UpdateSpot/UpdateSpot";
import { Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export const SpotPage = observer(()=>{
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  StoreInstance.user?.setPortfolioFromHref()

  const [selected, Select] = useState<SpotPosition | undefined>()
  if(!StoreInstance.portfolio){
    return <Typography variant="h1">Select portfolio!!</Typography>
  }
  return (<>
    <SpotTable onSelect={Select}/>
      <div style={{display: "flex", justifyContent: "space-around", flexDirection: "row", flexGrow: 4}}>
        <CreateSpot onClose={()=>setOpenCreate(false)} open={openCreate}/>
        {StoreInstance.portfolio && StoreInstance.user?.portfolios?.includes(StoreInstance.portfolio) && <>
          <Button variant="contained" color='success' onClick={()=>setOpenCreate(true)}>Добавить</Button>
          {selected && <>
            <Button variant="contained" color='info'  onClick={()=>setOpenUpdate(true)}>Изменить</Button>
            <UpdateSpot open={openUpdate} onClose={()=>setOpenUpdate(false)} pos={selected}/>
            <Button variant="contained" color='error' onClick={()=>StoreInstance.portfolio?.deleteSpotPosition(selected._id)}>УДАЛИТЬ</Button>
          </>}
        </>}
      </div>
    </>
  )
})