import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, Typography, Paper, CardContent, Card } from '@mui/material';
import { Portfolio } from '@/Store/Portfolio';
import styles from "./Portfolios.module.css"
import { StoreInstance } from '@/Store/Store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { PortfolioList } from '@/widgets/PortfolioList/PortfolioList';
import { CreatePortfolio } from '@/widgets/CreatePortfolio/CreatePortfolio';
import { UpdatePortfolio } from '@/widgets/UpdatePortfolio/UpdatePortfolio';
import { PieChart } from '@mui/x-charts/PieChart';
import { ExportFunction, portfolioToString } from './ExportFunction';
import { Axios } from '@/api/Axios';

export const Portfolios: React.FC = observer(() => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogExportOpen, setDialogExportOpen] = useState(false);

  const [UdialogOpen, setUDialogOpen] = useState(false);
  StoreInstance.user?.setPortfolioFromHref()

  const nav = useNavigate()
  if(!StoreInstance.user){
    return <Typography variant="h1">Sign in!!</Typography>
  }
  const handleSelectPortfolio = (portfolio: Portfolio) => {
    StoreInstance.user!.portfolio = (portfolio);
    nav("/portfolios?portfolio="+StoreInstance.user?.portfolio?._id, {replace: true})
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleOpenExportDialog = () => {
    setDialogExportOpen(true);
  };

  const handleCloseExportDialog = () => {
    setDialogExportOpen(false);
  };

  // Add more handlers for create, update, and delete operations here
  if(!StoreInstance.user.portfolios){
    return <div>Error during load portfolios</div>
  }

  const outerRadius = 200

  const [positive, negative]: [{[key: string]: number}, {[key: string]: number}] = [{}, {}]
  const Stats = StoreInstance.user.portfolio?.getStats()
  for(const symbol in Stats){
    if(Stats[symbol]>0){
      positive[symbol] = Stats[symbol]
    }else{
      negative[symbol] = Stats[symbol]
    }
  }

  let negativeSum = 0
  let positiveSum = 0
  let negativeMin = 0
  let positiveMax = 0
  for(const symbol in negative){
    const stat = negative[symbol]
    negativeSum=negativeSum+stat
    if(stat<negativeMin){
      negativeMin = stat
    }
  }
  for(const symbol in positive){
    const stat = positive[symbol]
    positiveSum=positiveSum+stat
    if(stat>positiveMax){
      positiveMax = stat
    }
  }
  const [greater, less, greaterStats, lessStats] = Math.abs(positiveSum) > Math.abs(negativeSum) ? [positiveSum, negativeSum, positive, negative] : [negativeSum, positiveSum, negative, positive] 

  const minusRadius = outerRadius *(1 - Math.sqrt(Math.abs(less)/Math.abs(greater)))
  const innerRadius = outerRadius - minusRadius

  function getColor(number: number, high: number) {
    const minus = number > 0 ? false : true
    number = Math.round(number)

    number = ((Math.abs(number) / Math.abs(high))*200)+55
    number = Math.round(number)
    console.log(number)
    var hex = number.toString(16).padStart(2, '0');
    console.log(hex)
    // Возвращаем строку в формате RGB
    return minus ? '#' + hex + '3333' : '#' + '33' + hex + '33'; // Здесь синий компонент всегда 00
  }

  type data = {value: number, label: string, color: string}[]

  const greaterData: data = []
  for(const symbol in greaterStats){
    const stat = greaterStats[symbol]
    greaterData.push({value: (Math.abs(stat)/Math.abs(positiveSum+negativeSum)*100), label: ( stat > 0 ? "" : "-")+ symbol, color: stat > 0 ? getColor(stat, positiveMax) : getColor(stat, negativeMin)})
  }
  const lessData: data = []
  for(const symbol in lessStats){
    const stat = lessStats[symbol]
    lessData.push({value: (Math.abs(stat)/Math.abs(positiveSum+negativeSum)*100), label: ( stat > 0 ? "" : "-")+ symbol, color: stat > 0 ? getColor(stat, positiveMax) : getColor(stat, negativeMin)})
  }



  return (
    <div className={styles.page}>
      <div style={{width: "40vw", flexDirection: 'column', display: "flex", justifyContent: "space-around", minHeight: "80vh"}}>
        <PortfolioList handleSelect={handleSelectPortfolio}/>
        <div style={{width: "100%", display: "flex", justifyContent: "space-around"}}>

          <Button variant="contained" color="success" onClick={handleOpenDialog}>
            ДОБАВИТЬ
          </Button>
          {
          StoreInstance.user.portfolio && <>
          <Button variant="contained" color="info" onClick={()=>setUDialogOpen(true)}>
            ИЗМЕНИТЬ
          </Button>
          <Button variant="contained" color="error" onClick={()=>StoreInstance.user!.deletePortfolio(StoreInstance.user!.portfolio!._id)}>
            УДАЛИТЬ
          </Button>
          <UpdatePortfolio portfolio={StoreInstance.user.portfolio} dialogOpen={UdialogOpen} handleCloseDialog={()=>setUDialogOpen(false)}/>
          <Button onClick={handleOpenExportDialog}>ЭКСПОРТИРОВАТЬ ОТЧЕТ</Button>
          <Dialog open={dialogExportOpen} onClose={handleCloseExportDialog}>
            <DialogContent>
              <Button fullWidth onClick={ExportFunction}>ЭКСПОРТИРОВАТЬ В ФАЙЛ</Button>
              {StoreInstance.user.tgId && <Button fullWidth onClick={()=>Axios.post("/portfolios/tgreport", {report: portfolioToString()})}>ПРИСЛАТЬ В TELEGRAM</Button>}
            </DialogContent>
          </Dialog>
          </>
          }
        </div>
      </div>
      <CreatePortfolio dialogOpen={dialogOpen} handleCloseDialog={handleCloseDialog} />
      {StoreInstance.user?.portfolio && (
        <div style={{flexDirection: 'column', padding: 5, margin: 10}}>
          <Typography align="center" variant='h3' color="secondary"  style={{width: "100%", wordBreak:"break-word"}} >{StoreInstance.user.portfolio.name}</Typography>
          <Paper sx={{display:"flex", flexShrink: 1, justifyContent: "space-around", alignItems: "center", flexDirection: "column"}} style={{width: "50vw", wordBreak:"break-word", height: "100%"}}>
            <div style={{display:"flex", flexWrap: 'wrap', justifyContent: "space-around", padding: 20, width: "100%"}}>
              <Card sx={{flexGrow: 2, margin: 5}}>
                <CardContent>
                  <Typography variant="h5">
                    Стоимость
                  </Typography>
                  {(()=>{
                    const res = StoreInstance.convertFromUSD(positiveSum+negativeSum)
                    return [<Typography>{[res[0].toLocaleString(), res[1]]}</Typography>]
                    })()}
                </CardContent>
              </Card>
              <Card sx={{flexGrow: 2, margin: 5}}>
                <CardContent>
                  <Typography variant="h5">
                    Прибыль
                  </Typography>
                  <Typography variant="h4">
                    {StoreInstance.formatChange(...StoreInstance.convertFromUSD(StoreInstance.user.portfolio.getVolumeChange()))}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{flexGrow: 2, margin: 5}}>
                <CardContent>
                  <Typography variant="h5">
                    Доходность
                  </Typography>
                  <Typography variant="h4">
                    {StoreInstance.formatChange(StoreInstance.user.portfolio.getIncomePerc()," %")}
                  </Typography>
                </CardContent>
              </Card>
            </div>
            <Typography variant='h4'>Диверсификация</Typography>
            <div>
            <PieChart height={500} width={500}
              series={[
                {
                  data: lessData,
                  outerRadius: innerRadius-3,
                  paddingAngle: 2,
                  cornerRadius: 8
                },
                {
                  data: greaterData,
                  outerRadius: outerRadius,
                  innerRadius: innerRadius+3,
                  paddingAngle: 2,
                  cornerRadius: 8

                }
              ]}
            />
            </div>
            <div style={{display: "flex", justifyContent: "space-around", width: "100%", padding: 30}}>
              <Button size="large" variant="contained" color="secondary" onClick={()=>nav("/spot?portfolio="+StoreInstance.user?.portfolio?._id)}>
                СПОТ
              </Button>
              <Button size="large" variant="contained" color="secondary" onClick={()=>nav("/futures?portfolio="+StoreInstance.user?.portfolio?._id)}>
                ФЬЮЧЕРСЫ
              </Button>
            </div>
          </Paper>
          
        </div>
      )}
    </div>
  );
});

