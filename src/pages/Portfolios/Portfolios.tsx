import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, Typography, Paper } from '@mui/material';
import { Portfolio } from '@/Store/Portfolio';
import styles from "./Portfolios.module.css"
import { StoreInstance } from '@/Store/Store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { PortfolioList } from '@/widgets/PortfolioList/PortfolioList';
import { CreatePortfolio } from '@/widgets/CreatePortfolio/CreatePortfolio';

export const Portfolios: React.FC = observer(() => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const nav = useNavigate()
  if(!StoreInstance.user){
    return <Typography variant="h1">Sign in!!</Typography>
  }
  const handleSelectPortfolio = (portfolio: Portfolio) => {
    StoreInstance.user!.portfolio = (portfolio);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Add more handlers for create, update, and delete operations here
  if(!StoreInstance.user.portfolios){
    return <div></div>
  }
  return (
    <div className={styles.page}>
      <div style={{width: "50vw"}}>
        <Typography variant='h4' color={"white"}>Портфели</Typography>
        <PortfolioList handleSelect={handleSelectPortfolio}/>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add Portfolio
        </Button>
        {
        StoreInstance.user.portfolio && (
        <Button variant="contained" color="error" onClick={()=>StoreInstance.user!.deletePortfolio(StoreInstance.user!.portfolio!._id)}>
          delete Portfolio
        </Button>
        
        )
        }
        <Button variant="contained" color="secondary" onClick={()=>nav("/spot")}>
          SPOT
        </Button>
        <Button variant="contained" color="secondary" onClick={()=>nav("/futures")}>
            FUTURES
        </Button>
      </div>
      <CreatePortfolio dialogOpen={dialogOpen} handleCloseDialog={handleCloseDialog} />
      {StoreInstance.user?.portfolio && (
        <div style={{flexDirection: 'column', padding: 5, width: "45vw", height: "70vh", margin: 10}}>
          <Typography variant='h4' color="secondary"  style={{width: "100%", wordBreak:"break-word"}} >{StoreInstance.user.portfolio.name}</Typography>
          <Paper style={{width: "100%", wordBreak:"break-word", height: "100%"}}>{StoreInstance.user.portfolio.description}</Paper>
          {/* Add more portfolio details and actions here */}
        </div>
      )}
    </div>
  );
});

