import { Portfolio } from "@/Store/Portfolio";
import { StoreInstance } from "@/Store/Store";
import { List, ListItem, ListItemText } from "@mui/material";



interface Props  {
  handleSelect: (p: Portfolio) => void
}
export const PortfolioList : React.FC<Props>=  ({handleSelect}) => {
  return (
    <List sx={{
      width: '100%',
      height: '70vh',
      maxWidth: 700,
      bgcolor: 'background.paper',
      overflowY: 'auto',
      overflowX: 'hidden',

    }}>
      {
      StoreInstance.user?.portfolios
      &&
      StoreInstance.user.portfolios.map((portfolio) => (
        <ListItem style={{width: "100%"}} onClick={() => handleSelect(portfolio)} key={portfolio._id}>
          <ListItemText color={portfolio._id === StoreInstance.user?.portfolio?._id ? "primary" : "secondary"} primary={portfolio.name} secondary={portfolio.description} />
        </ListItem>
      ))}
    </List>
  )
}