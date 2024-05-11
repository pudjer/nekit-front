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
  if(!StoreInstance.user?.portfolio){
    return <Typography variant="h1">Select portfolio!!</Typography>
  }
  return (
    <div>
      <FuturesTable onSelect={Select}/>
      <CreateFutures onClose={()=>setOpenCreate(false)} open={openCreate}/>
      <Button variant="contained" color='success' onClick={()=>setOpenCreate(true)}>Добавить</Button>
      {selected && <Button variant="contained" color='info'  onClick={()=>setOpenUpdate(true)}>Изменить</Button>}
      {selected && openUpdate && <UpdateFutures open onClose={()=>setOpenUpdate(false)} pos={selected}/>}
      {selected && <Button variant="contained" color='error' onClick={()=>StoreInstance.user?.portfolio?.deleteFuturesPosition(selected._id)}>УДАЛИТЬ</Button>}
    </div>
  )
})