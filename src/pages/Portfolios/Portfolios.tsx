import React, { useState, useEffect } from 'react';
import { getPortfolios, createPortfolio, deletePortfolio, getPortfolio, updatePortfolio, createPortfolioDTO} from '@/models/Portfolio/Api';
import { List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box, Typography, Paper } from '@mui/material';
import { Portfolio } from '@/models/Portfolio/Portfolio';
import { useForm } from 'react-hook-form';
import styles from "./Portfolios.module.css"
import { StoreInstance } from '@/models/Store';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

export const Portfolios: React.FC = observer(() => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { register, handleSubmit } = useForm<createPortfolioDTO>();
  useEffect(() => {
    loadPortfolios();
  }, []);
  const nav = useNavigate()
  const loadPortfolios = async () => {
    const portfolios = await getPortfolios();
    setPortfolios(portfolios);
  };

  const handleSelectPortfolio = (portfolio: Portfolio) => {
    StoreInstance.portfolio = (portfolio);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Add more handlers for create, update, and delete operations here

  return (
    <div className={styles.page}>
      <div style={{width: "50vw"}}>
        <Typography variant='h4' color={"white"}>Портфели</Typography>
        <List sx={{
          width: '100%',
          height: '70vh',
          maxWidth: 700,
          bgcolor: 'background.paper',
          overflowY: 'auto',
          overflowX: 'hidden',

        }}>
          {portfolios.map((portfolio) => (
            <ListItem style={{width: "100%"}} onClick={() => handleSelectPortfolio(portfolio)} key={portfolio._id}>
              <ListItemText color={portfolio._id === StoreInstance.portfolio?._id ? "primary" : "secondary"} primary={portfolio.name} secondary={portfolio.description} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Add Portfolio
        </Button>
        <Button variant="contained" color="secondary" onClick={()=>nav("/portfolio")}>
          To portfolio
        </Button>
      </div>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add a new portfolio</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit((d)=>createPortfolio(d).then(portf =>setPortfolios([...portfolios, portf])))} noValidate autoComplete="off">
            <TextField
              {...register('name', { required: true })}
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register('description')}
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register('currency')}
              label="Currency"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Create Portfolio
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      {StoreInstance.portfolio && (
        <div style={{flexDirection: 'column', padding: 5, width: "45vw", height: "70vh", margin: 10}}>
          <Typography variant='h4' color="secondary"  style={{width: "100%", wordBreak:"break-word"}} >{StoreInstance.portfolio.name}</Typography>
          <Paper style={{width: "100%", wordBreak:"break-word", height: "100%"}}>{StoreInstance.portfolio.description}</Paper>
          {/* Add more portfolio details and actions here */}
        </div>
      )}
    </div>
  );
});

