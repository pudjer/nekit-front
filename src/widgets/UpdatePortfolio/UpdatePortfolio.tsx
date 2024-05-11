import { Portfolio } from "@/Store/Portfolio";
import { StoreInstance } from "@/Store/Store"
import { createPortfolioDTO } from "@/Store/User";
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button } from "@mui/material"
import { useForm } from "react-hook-form";

export const UpdatePortfolio: React.FC<{dialogOpen:boolean, handleCloseDialog:()=>void, portfolio: Portfolio}> = ({dialogOpen, handleCloseDialog, portfolio})=> {
  const { register, handleSubmit } = useForm<createPortfolioDTO>();

  return(
    <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Add a new portfolio</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit((d)=>StoreInstance.user!.updatePortfolio(portfolio._id, d))} noValidate autoComplete="off">
            <TextField
              {...register('name', { required: true })}
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              defaultValue={portfolio.name}
            />
            <TextField
              {...register('description')}
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              defaultValue={portfolio.description}

            />
            <Button type="submit" variant="contained" color="primary">
              update Portfolio
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
  )
}