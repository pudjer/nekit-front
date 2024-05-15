import { Portfolio } from "@/Store/Portfolio";
import { StoreInstance } from "@/Store/Store";
import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";



interface Props  {
  handleSelect: (p: Portfolio) => void
  portfolios: Portfolio[]
}
export const PortfolioList : React.FC<Props>=  observer(({handleSelect, portfolios}) => {
  return (
    <div style={{display: "flex", flexDirection: 'column',justifyContent: "space-around", alignItems: "stretch", height: "100%", width: "100%"}}>
      <List sx={{
        maxWidth: "40vw",
        height: "100%",
        bgcolor: 'background.paper',
        overflow: 'auto',
        borderRadius: 5,
        margin: 5
      }}>
        {portfolios.map((portfolio) => {
          const res = StoreInstance.convertFromUSD(portfolio.getValue())
          return <ListItem
            key={portfolio._id}
            style={{  border: "1px solid #ccc", display: "flex", justifyContent: "space-between",borderRadius: 10, ...(portfolio === StoreInstance.portfolio ? {backgroundColor: "#080721"}: {})}}
            onClick={() => handleSelect(portfolio)}
          >
            <div>
            <Typography variant="h5">{portfolio.name}</Typography>
            <Typography>{portfolio.description}</Typography>
            </div>

            {StoreInstance.user && (
              StoreInstance.user.favoritePortfolios.includes(portfolio) 
              ? 
              <Button onClick={async ()=>StoreInstance.user?.deleteFavorite(portfolio)}>Удалить из ИЗБРАННого</Button>
               : 
              <Button onClick={async ()=>StoreInstance.user?.addFavorite(portfolio)}>В ИЗБРАННОЕ</Button>)
            }
            <Typography variant="h5">{
              [res[0].toLocaleString(), res[1]]
            }</Typography>
          </ListItem>
        })}
      </List>
    </div>
  )
})