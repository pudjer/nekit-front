import { Portfolio } from "@/Store/Portfolio";
import { StoreInstance } from "@/Store/Store";
import { List, ListItem, ListItemText, Typography } from "@mui/material";



interface Props  {
  handleSelect: (p: Portfolio) => void
}
export const PortfolioList : React.FC<Props>=  ({handleSelect}) => {
  return (
    <div style={{display: "flex", flexDirection: 'column',justifyContent: "space-around", alignItems: "stretch", height: "100%"}}>
      <Typography align="center" variant='h4' color={"white"}>Портфели</Typography>
      <List sx={{
        maxWidth: "40vw",
        bgcolor: 'background.paper',
        overflow: 'auto'
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
    </div>
  )
}