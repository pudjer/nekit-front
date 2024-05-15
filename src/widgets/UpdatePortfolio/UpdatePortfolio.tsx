import { Portfolio } from "@/Store/Portfolio";
import { StoreInstance } from "@/Store/Store"
import { createPortfolioDTO } from "@/Store/User";
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Typography } from "@mui/material"
import { useForm } from "react-hook-form";

export const UpdatePortfolio: React.FC<{dialogOpen:boolean, handleCloseDialog:()=>void, portfolio: Portfolio}> = ({dialogOpen, handleCloseDialog, portfolio})=> {
  const { register, handleSubmit } = useForm<createPortfolioDTO>();

  return(
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Изменить портфель</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit((d)=>StoreInstance.user!.updatePortfolio(portfolio._id, d))} noValidate autoComplete="off">
            <TextField
              {...register('name', { required: true })}
              label="Название"
              variant="outlined"
              fullWidth
              margin="normal"
              defaultValue={portfolio.name}
            />
            <TextField
              {...register('description')}
              label="Описание"
              variant="outlined"
              fullWidth
              margin="normal"
              defaultValue={portfolio.description}

            />
            <div style={{display: "flex", alignItems: "center"}}>
              <TextField
              {...register('isPublic')}
              variant="outlined"
              margin="normal"
              type="checkbox"
              sx={{width: 30, height: 50}}
              defaultChecked={portfolio.isPublic}
            />
            <Typography>Публичный</Typography>
            </div>
            <Button type="submit" variant="contained" color="primary">
              ИЗМЕНИТЬ
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
  )
}