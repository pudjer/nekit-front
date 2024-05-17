import { FuturesPosition } from "@/Store/FuturesPosition";
import { StoreInstance } from "@/Store/Store";
import { Chart } from "@/widgets/Chart/Chart";
import { CreateFutures } from "@/widgets/CreateFutures/CreateFutures";
import { FuturesTable } from "@/widgets/FuturesTable/FuturesTable";
import { UpdateFutures } from "@/widgets/UpdateFutures/UpdateFutures";
import { AppBar, Button, Dialog, DialogContent, IconButton, Toolbar, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";

export const FuturesPage = observer(()=>{
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const [selected, Select] = useState<FuturesPosition | undefined>()
  const [openStats, setOpenStats] = useState<boolean>(false)
  StoreInstance.setPortfolioFromHref()
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
                <Chart symbol={selected.symbol} valueFn={p=>(((selected.margin + ((p * selected.quantity - selected.initialPrice * selected.quantity)))/selected.margin) * 100)-100} curr={selected.currency} since={selected.timestamp} until={selected.exitTimestamp}/>
                <Typography variant="h4">Прибыль({selected.currency})</Typography>
                <Chart symbol={selected.symbol} valueFn={p=>((p * selected.quantity - selected.initialPrice * selected.quantity))} curr={selected.currency} since={selected.timestamp} until={selected.exitTimestamp}/>
                <Typography variant="h4">Ценность({selected.currency})</Typography>
                <Chart symbol={selected.symbol} valueFn={p=>(selected.margin + (p * selected.quantity - selected.initialPrice * selected.quantity))} curr={selected.currency} since={selected.timestamp} until={selected.exitTimestamp}/>
            </Dialog>
          </>}
        </>}
      </div>
    </>
  )
})