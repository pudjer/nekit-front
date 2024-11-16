import { StoreInstance } from "@/Store/Store";
import { AdminPage } from "@/pages/AdminPage/AdminPage";
import { observer } from "mobx-react-lite";

export const CallPage: React.FC = observer(()=>{
  const user = StoreInstance.user
  if(!user)return <div>Please Sign In!!</div>
  if(user.isAdmin){
    return <AdminPage />
  }else{
    return <AdminPage/ >
  }

})