import { observer } from 'mobx-react-lite';
import { getPortfolios } from '@/models/Portfolio/Api';
import { StoreInstance } from '@/models/Store';
import { Button, Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material';
import { useEffect, useState } from 'react';
import { Portfolio } from '@/models/Portfolio/Portfolio';
import styles from "./PortfolioButton.module.css"
import { useNavigate } from 'react-router-dom';

const PortfolioSelect = observer(() => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const nav = useNavigate()
  useEffect(()=>{
    getPortfolios().then(ps=>setPortfolios(ps))
  }, [])



  return (
    <FormControl variant='standard' style={{width: "20%"}}>
      <InputLabel id={styles.portfolioSelect} onClick={StoreInstance.portfolio && (()=>nav("/portfolio"))}>Portfolio</InputLabel>
      <Select style={{overflow: "hidden"} }
        labelId={styles.portfolioSelect}
        value={ StoreInstance.portfolio?.name }
        label="Age"
      >
        {portfolios.map((portfolio) => (
          <MenuItem key={portfolio._id} value={portfolio.name} style={{maxWidth: "50vw"}} onClick={()=>{StoreInstance.portfolio = portfolio}}>
            {portfolio.name}
          </MenuItem>
        ))}
      </Select>
      
    </FormControl>
  );
});

export default PortfolioSelect;
