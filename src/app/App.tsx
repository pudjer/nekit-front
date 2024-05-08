import { Portfolios } from "@/pages/Portfolios/Portfolios"
import { Footer } from "@/widgets/Footer"
import Header from "@/widgets/Header/Header"
import { Route, Routes } from "react-router-dom"
import { BrowserRouter } from "react-router-dom"

function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="home" Component={()=><div>home</div>}/>
        <Route path="portfolios" Component={()=><Portfolios/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
