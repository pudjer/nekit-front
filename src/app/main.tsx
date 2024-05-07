import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';



const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff',
    },
    secondary: {
      main: '#646CFF',
    },
    background: {
      default: '#020208',
      paper: '#1f2437',
    },
    divider: '#00ffff',
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
