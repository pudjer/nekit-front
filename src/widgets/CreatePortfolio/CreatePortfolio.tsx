import { StoreInstance } from "@/Store/Store"
import { createPortfolioDTO } from "@/Store/User";
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from "@mui/material"
import { useForm } from "react-hook-form";

export const CreatePortfolio: React.FC<{dialogOpen:boolean, handleCloseDialog:()=>void}> = ({dialogOpen, handleCloseDialog})=> {
  const { register, handleSubmit } = useForm<createPortfolioDTO>();

  return(
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Добавить портфель</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit((d)=>StoreInstance.user!.createPortfolio(d))} noValidate autoComplete="off">
            <TextField
              {...register('name', { required: true })}
              label="Название"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              {...register('description')}
              label="Описание"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              Добавить
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
  )
}