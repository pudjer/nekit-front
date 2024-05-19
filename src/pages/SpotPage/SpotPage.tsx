import { SpotPosition } from "@/Store/SpotPosition";
import { StoreInstance } from "@/Store/Store";
import { Chart } from "@/widgets/Chart/Chart";
import { CreateSpot } from "@/widgets/CreateSpot/CreateSpot";
import { SpotTable } from "@/widgets/SpotTable/SpotTable";
import { UpdateSpot } from "@/widgets/UpdateSpot/UpdateSpot";
import { AppBar, Button, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export const SpotPage = observer(()=>{
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const [openStats, setOpenStats] = useState<boolean>(false)

  StoreInstance.setPortfolioFromHref()

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
            <UpdateSpot key={selected._id} open={openUpdate} onClose={()=>setOpenUpdate(false)} pos={selected}/>
            <Button variant="contained" color='error' onClick={()=>StoreInstance.portfolio?.deleteSpotPosition(selected._id)}>УДАЛИТЬ</Button>
            <Button variant="contained" color='info'  onClick={()=>setOpenStats(true)}>статистика</Button>
            <Dialog fullScreen open={openStats}>
            <AppBar sx={{ position: 'relative' }}>
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={()=>setOpenStats(false)}
                  aria-label="close"
                >
                  ЗАКРЫТЬ
                </IconButton>
              </Toolbar>
            </AppBar>
                <Typography variant="h4">Прибыль(%)</Typography>
                <Chart symbol={selected.symbol} valueFn={p=>((p/(selected.initialPrice*(StoreInstance.currency?.exchangeRateToUsd || 1)))*100-100)} since={selected.timestamp} until={selected.exitTimestamp}/>
                <Typography variant="h4">Ценность({StoreInstance.currency?.symbol || "USD"})</Typography>
                <Chart symbol={selected.symbol} valueFn={p=>p*selected.quantity} since={selected.timestamp}  until={selected.exitTimestamp} />
            </Dialog>
          </>}
        </>}
      </div>
    </>
  )
})