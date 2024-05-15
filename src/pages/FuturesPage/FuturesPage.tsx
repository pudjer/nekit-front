import { FuturesPosition } from "@/Store/FuturesPosition";
import { StoreInstance } from "@/Store/Store";
import { CreateFutures } from "@/widgets/CreateFutures/CreateFutures";
import { FuturesTable } from "@/widgets/FuturesTable/FuturesTable";
import { UpdateFutures } from "@/widgets/UpdateFutures/UpdateFutures";
import { Button, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export const FuturesPage = observer(()=>{
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)

  const [selected, Select] = useState<FuturesPosition | undefined>()
  StoreInstance.user?.setPortfolioFromHref()
  if(!StoreInstance.portfolio){
    return <Typography variant="h1">Select portfolio!!</Typography>
  }
  return (<>
    <FuturesTable onSelect={Select}/>
      <div style={{display: "flex", justifyContent: "space-around", flexDirection: "row", flexGrow: 4}}>
        <CreateFutures onClose={()=>setOpenCreate(false)} open={openCreate}/>
        {StoreInstance.portfolio && StoreInstance.user?.portfolios?.includes(StoreInstance.portfolio) && <>
          <Button variant="contained" color='success' onClick={()=>setOpenCreate(true)}>Добавить</Button>
          {selected &&<>
            <Button variant="contained" color='info'  onClick={()=>setOpenUpdate(true)}>Изменить</Button>
            <UpdateFutures open={openUpdate} onClose={()=>setOpenUpdate(false)} pos={selected}/>
            <Button variant="contained" color='error' onClick={()=>StoreInstance.portfolio?.deleteFuturesPosition(selected._id)}>УДАЛИТЬ</Button>
          </>}
        </>}
      </div>
    </>
  )
})