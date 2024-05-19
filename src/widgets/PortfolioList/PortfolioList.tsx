import { Portfolio } from "@/Store/Portfolio";
import { StoreInstance } from "@/Store/Store";
import { Button, List, ListItem, Popover, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";



interface Props  {
  handleSelect: (p: Portfolio) => void
  portfolios: Portfolio[]
}
export const PortfolioList : React.FC<Props>=  observer(({handleSelect, portfolios}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <div style={{display: "flex", flexDirection: 'column',justifyContent: "space-around", alignItems: "stretch", height: "100%", width: "100%", maxHeight: "78vh"}}>
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
            style={{ height: 80, width: "99%", margin: 3, border: "1px solid #ccc", display: "flex", justifyContent: "space-between",borderRadius: 10, ...(portfolio === StoreInstance.portfolio ? {backgroundColor: "#080721"}: {})}}
            onClick={() => handleSelect(portfolio)}
          >
            <div style={{width: "30%"}}>
            <Typography variant="h5">{portfolio.name}</Typography>
            <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: 'none',
              }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
            <Typography sx={{ p: 1, maxWidth : "50vw", overflowWrap: "break-word" }}>{anchorEl?.innerText}</Typography>
            </Popover>
            <Typography
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              style={{textOverflow: "ellipsis", width: "100%", overflow: "hidden"}}>
                {portfolio.description}
            </Typography>
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