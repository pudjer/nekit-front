import { StoreInstance } from "@/Store/Store"
import { createPortfolioDTO } from "@/Store/User";
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from "@mui/material"
import { useForm } from "react-hook-form";

export const CreatePortfolio: React.FC<{dialogOpen:boolean, handleCloseDialog:()=>void}> = ({dialogOpen, handleCloseDialog})=> {
  const { register, handleSubmit } = useForm<createPortfolioDTO>();

  return(
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add a new portfolio</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit((d)=>StoreInstance.user!.createPortfolio(d))} noValidate autoComplete="off">
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
  )
}