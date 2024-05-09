import { observer } from 'mobx-react-lite';
import { StoreInstance } from '@/Store/Store';
import { Button, Select, MenuItem, SelectChangeEvent, InputLabel, FormControl } from '@mui/material';
import styles from "./PortfolioSelect.module.css"
import { useNavigate } from 'react-router-dom';

const PortfolioSelect = observer(() => {


  return (
    <FormControl variant='standard' style={{width: 200}}>
      <InputLabel>Portfolio</InputLabel>
      <Select style={{overflow: "hidden"} }
        labelId={styles.portfolioSelect}
        value={ StoreInstance?.user?.portfolio?.name || ''}
        label="Portfolio"
      >
        {
        StoreInstance?.user?.portfolios
        &&
        StoreInstance?.user?.portfolios.map((portfolio) => (
          <MenuItem key={portfolio._id} value={portfolio.name} style={{maxWidth: "50vw"}} onClick={()=>{StoreInstance.user!.portfolio = portfolio}}>
            {portfolio.name}
          </MenuItem>
        ))}
      </Select>
      
    </FormControl>
  );
});

export default PortfolioSelect;
