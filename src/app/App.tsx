import { StoreInstance } from "@/Store/Store"
import ErrorPage from "@/pages/ErrorPage/ErrorPage"
import { FuturesPage } from "@/pages/FuturesPage/FuturesPage"
import { HomePage } from "@/pages/HomePage/HomePage"
import { Portfolios } from "@/pages/Portfolios/Portfolios"
import { SpotPage } from "@/pages/SpotPage/SpotPage"
import { WelcomePage } from "@/pages/WelcomPage/WelcomPage"
import { Footer } from "@/widgets/Footer"
import Header from "@/widgets/Header/Header"
import { Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { Route, Routes } from "react-router-dom"
import { BrowserRouter } from "react-router-dom"

const App = observer(() => {
  if(StoreInstance.isLoading){
    return <Typography variant="h1">Loading...</Typography>
  }
  if(StoreInstance.error){
    return <ErrorPage/>
  }
  return (
    <BrowserRouter>
      <Header/>
      <div style={{marginTop: 70, width:"100vw"}}>
      <Routes>
        <Route path="home" Component={()=><HomePage/>}/>
        <Route path="portfolios" Component={()=><Portfolios/>}/>
        <Route path="futures" Component={()=><FuturesPage/>}/>
        <Route path="spot" Component={()=><SpotPage/>}/>
        <Route path="/" Component={()=><WelcomePage/>}/>
      </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  )
})

export default App
