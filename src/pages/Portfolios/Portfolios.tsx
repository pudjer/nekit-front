import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, Typography, Paper, CardContent, Card, Divider, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Portfolio } from '@/Store/Portfolio';
import styles from "./Portfolios.module.css"
import { StoreInstance } from '@/Store/Store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { PortfolioList } from '@/widgets/PortfolioList/PortfolioList';
import { CreatePortfolio } from '@/widgets/CreatePortfolio/CreatePortfolio';
import { UpdatePortfolio } from '@/widgets/UpdatePortfolio/UpdatePortfolio';
import { PieChart } from '@mui/x-charts/PieChart';
import { ExportFunction, download } from './ExportFunction';
import { Axios } from '@/api/Axios';



enum PortfoliosChoise{
  MY,
  PUBLIC,
  FAVORITE,
}


export const Portfolios: React.FC = observer(() => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogExportOpen, setDialogExportOpen] = useState(false);
  const [dataIndex, setDataIndex] = useState<number>();
  const [UdialogOpen, setUDialogOpen] = useState(false);
  let [portfoliosChoise, setChoise] = useState<PortfoliosChoise>(PortfoliosChoise.PUBLIC)
  const [publicPortfs, setPublicPortfs] = useState<Portfolio[]>([])
  StoreInstance.setPortfolioFromHref()
  useEffect(()=>{
    const res = Axios.get("/portfolios/public").then(res=>res.data.map((portf: Portfolio)=>Portfolio.fromProps(portf)))
    res.then(e=>setPublicPortfs(e))
  }, [])
  const handleChange = (event: unknown) => {
    //@ts-ignore
    setChoise(event.target.value);
  };
  const nav = useNavigate()

  const handleSelectPortfolio = (portfolio: Portfolio) => {
    StoreInstance.portfolio = (portfolio);
    nav("/portfolios?portfolio="+StoreInstance.portfolio?._id, {replace: true})
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


  const Stats = StoreInstance.portfolio?.getStats()
  let valueSum = 0
  for(const symbol in Stats){
    const stat = Stats[symbol]

    valueSum=valueSum+stat
  }
  type Data = {value: number, label: string}[]
  const data: Data = []
  for(const symbol in Stats){
    const stat = Stats[symbol]
    data.push({value: (stat/valueSum)*100, label: symbol})
  }
  const value = StoreInstance.convertFromUSD(valueSum)

  const variants = {
    [PortfoliosChoise.MY]: StoreInstance.user?.portfolios,
    [PortfoliosChoise.FAVORITE]: StoreInstance.user?.favoritePortfolios,
    [PortfoliosChoise.PUBLIC]: publicPortfs
  }
  return (
    <div className={styles.page}>
      <div style={{width: "40vw", flexDirection: 'column', display: "flex", justifyContent: "space-around", minHeight: "80vh", alignItems: "center", flexShrink: 0}}>
        {StoreInstance.user && <FormControl sx={{width: "100%", marginLeft: 10}}>
        <InputLabel id="portfolio-select-label">Выберите портфели</InputLabel>
          <Select
            labelId="portfolio-select-label"
            value={portfoliosChoise}
            onChange={handleChange}
            label="Выберите портфели"
            sx={{width: "60%"}}
          >
            <MenuItem value={PortfoliosChoise.PUBLIC}>Публичные портфели</MenuItem>
            <MenuItem value={PortfoliosChoise.MY}>Мои портфели</MenuItem>
            <MenuItem value={PortfoliosChoise.FAVORITE}>Избранные портфели</MenuItem>
          </Select>
        </FormControl>}
        {variants[portfoliosChoise] && <PortfolioList portfolios={
          variants[portfoliosChoise] || []
        } handleSelect={handleSelectPortfolio}/>}
        <div style={{width: "100%", display: "flex", justifyContent: "space-around"}}>

          {portfoliosChoise === PortfoliosChoise.MY && <Button variant="contained" color="success" onClick={handleOpenDialog}>
            ДОБАВИТЬ
          </Button>}
          
          {StoreInstance.portfolio?.userId === (StoreInstance.user?._id || 0) && <>
            <Button variant="contained" color="info" onClick={()=>setUDialogOpen(true)}>
              ИЗМЕНИТЬ
            </Button>
            <Button variant="contained" color="error" onClick={()=>StoreInstance.user!.deletePortfolio(StoreInstance.portfolio!._id)}>
              УДАЛИТЬ
            </Button>
            <UpdatePortfolio key={StoreInstance.portfolio._id} portfolio={StoreInstance.portfolio} dialogOpen={UdialogOpen} handleCloseDialog={()=>setUDialogOpen(false)}/>
            <Button onClick={handleOpenExportDialog}>ЭКСПОРТИРОВАТЬ ОТЧЕТ</Button>
            <Dialog open={dialogExportOpen} onClose={handleCloseExportDialog}>
              <DialogContent>
                <Button fullWidth onClick={download}>ЭКСПОРТИРОВАТЬ В ФАЙЛ</Button>
                {StoreInstance.user?.tgId && <Button fullWidth onClick={()=>Axios.post("/portfolios/tgreport", {report: ExportFunction()})}>ПРИСЛАТЬ В TELEGRAM</Button>}
              </DialogContent>
            </Dialog>
          </>}

        </div>
      </div>
      <CreatePortfolio dialogOpen={dialogOpen} handleCloseDialog={handleCloseDialog} />

      {(StoreInstance.portfolio) && (
        <div style={{flexDirection: 'column', padding: 5, margin: 10}}>
          <Typography align="center" variant='h3' color="secondary"  style={{width: "100%", wordBreak:"break-word", marginBottom: 20}} >{StoreInstance.portfolio.name}</Typography>
          <Paper sx={{display:"flex", flexShrink: 1, justifyContent: "space-around", alignItems: "center", flexDirection: "column"}} style={{width: "50vw", wordBreak:"break-word", height: "100%", borderRadius: 30}}>
            <div style={{display:"flex", flexWrap: 'wrap', justifyContent: "space-around", padding: 20, width: "100%"}}>
              <Card sx={{flexGrow: 2, margin: 5}}>
                <CardContent>
                  <Typography variant="h5">
                    Стоимость
                  </Typography>
                  {[value[0].toLocaleString(), value[1]]}
                </CardContent>
              </Card>
              <Card sx={{flexGrow: 2, margin: 5}}>
                <CardContent>
                  <Typography variant="h5">
                    Прибыль
                  </Typography>
                  <Typography variant="h4">
                    {StoreInstance.formatChange(...StoreInstance.convertFromUSD(StoreInstance.portfolio.getVolumeChange()))}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{flexGrow: 2, margin: 5}}>
                <CardContent>
                  <Typography variant="h5">
                    Доходность
                  </Typography>
                  <Typography variant="h4">
                    {StoreInstance.formatChange(StoreInstance.portfolio.getIncomePerc()," %")}
                  </Typography>
                </CardContent>
              </Card>
            </div>
            <Typography variant='h4'>Диверсификация</Typography>
            <div>
              <PieChart height={500} width={500}
                series={[
                  {
                    data: data,
                    outerRadius: 200,
                    innerRadius: 170,
                    paddingAngle: 0.3,
                    cornerRadius: 8,
                  }
                ]}
                slotProps={{
                  legend: { hidden: true },
                }}
                onItemClick={(_, d)=>setDataIndex(d.dataIndex)}
              />
              {dataIndex !== undefined && dataIndex<data.length ? 
              <div style={{overflow: "visible", width: 0, height: 0}}>
                <div className={styles.box}>
                  <Typography variant="h5">
                    Доля портфеля: 
                  </Typography>
                  <Typography variant="h5">
                    {data[dataIndex].value.toLocaleString()+" %"}
                  </Typography>
                  <Typography variant="h5">
                    <img style={{height: 30, width: 30}} src={StoreInstance.tokensMap.get(data[dataIndex].label)?.image}/>
                    {data[dataIndex].label}
                  </Typography>
                  <Divider/>
                  <Typography variant='h5'>
                    Количество: 
                  </Typography>
                  <Typography variant='h5'>
                    {Stats && (()=>{
                      const res = StoreInstance.convertFromUSD(Stats[data[dataIndex].label])
                      return [res[0].toLocaleString(), res[1]]
                    })()}
                  </Typography>
                </div>
              </div> : undefined}
            </div>
            <div style={{display: "flex", justifyContent: "space-around", width: "100%", padding: 30}}>
              <Button size="large" variant="contained" color="secondary" onClick={()=>nav("/spot?portfolio="+StoreInstance.portfolio?._id)}>
                СПОТ
              </Button>
              <Button size="large" variant="contained" color="secondary" onClick={()=>nav("/futures?portfolio="+StoreInstance.portfolio?._id)}>
                ФЬЮЧЕРСЫ
              </Button>
            </div>
          </Paper>
          
        </div>
      )}
    </div>
  );
});

