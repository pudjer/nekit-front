import { StoreInstance } from "@/Store/Store";
import { CallPage } from "@/pages/CallPage/CallPage";
import ProfileButton from "@/widgets/ProfileButton/ProfileButton";
import { Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AdminPage } from "../AdminPage/AdminPage";

export const MainPage: React.FC = observer(()=>{
  const user = StoreInstance.user
  if(!user) {
    return <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
      <div><Typography variant="h4">Пожалуйста, войдите в учетную запись</Typography></div>
      <ProfileButton/>
    </div>
  }
  if(user.isAdmin){
    return <AdminPage/>
  }else{
    return <CallContainer/>
  }
})

const CallContainer = () => {
  const [callOpened, setCallOpened] = useState(false)
  return <div>
    {
      callOpened 
      ?
      <CallPage close={()=>setCallOpened(false)}/>
      :
      <button onClick={()=>setCallOpened(true)}>open</button>
    }
  </div>
}