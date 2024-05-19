import { observer } from 'mobx-react-lite';
import { StoreInstance } from '@/Store/Store';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import styles from "./PortfolioSelect.module.css"

const PortfolioSelect = observer(() => {


  return (
    <FormControl variant='standard' style={{width: 200}}>
      <InputLabel>Portfolio</InputLabel>
      <Select style={{overflow: "hidden"} }
        labelId={styles.portfolioSelect}
        value={ StoreInstance.portfolio?.name || ''}
        label="Portfolio"
      >
        {
        StoreInstance.user?.portfolios
        &&
        StoreInstance.user?.portfolios.map((portfolio) => (
          <MenuItem key={portfolio._id} value={portfolio.name} style={{maxWidth: "50vw"}} onClick={()=>{StoreInstance.portfolio = portfolio}}>
            {portfolio.name}
          </MenuItem>
        ))}
      </Select>
      
    </FormControl>
  );
});

export default PortfolioSelect;
