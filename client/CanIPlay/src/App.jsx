import './App.css'
import Home from './pages/Home/Home.jsx'
import GamePage from './pages/GamePage/GamePage.jsx'
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header.jsx'

function App() {
  const theme = createTheme({
    components:{
      MuiCard:{
        defaultProps:{
          raised:true,
        }
      }
    },
    typography: {
      h5: { fontWeight: 300 },
      smallShadow: '0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.5)',
      invSmallShadow: '-0.125rem -0.125rem -0.25rem rgba(0, 0, 0, 0.5)'
    },
    palette: {
      background: {
        default: "#2c213f", //old: #584D87
        accent:"#463b5a",
        background:"#130922",
      },
      primary: {
        main: "#2c213f",
      },
      common:{
        offwhite:"#d8d8d8"
      },
      secondary: {
        main: "#463b5a",
      },
      accent:{
        main:"#463b5a",
        light:"#514862"
      },
      xbox:{
        dark:'#107c10',
        main:'#2ca243',
        light:'#77bb44',
        darker:'#106610',
        text:"#d8d8d8"
      },
      ps:{
        dark:'#253f81',
        main:'#253f81',
        darker:"#132961",
        text:'#FFC300',
        light:"#4d83c1",
      },
      ea:{
        text:'#ff7070',
        dark:'#0d1043',
        darker:'#0d1043',
        light:'#fe4646',
      },
      ubi:{
        text:'#000000',
        dark:'#4f3a75',
        darker:'#6d6ea7',
        light:'#a1a9d3'
      }
    },
  }); ; 

  return (
    <>
    <ThemeProvider theme={theme}>
    <CssBaseline/>
    <Router> 
      <Routes> 
          <Route path="/" element={<Home />} /> 
          <Route path="/game/:gameId" element={<GamePage />} /> 
          <Route path="/?p=:id" element={<Home />}/> 
          <Route path="/?s=:id" element={<Home />}/> 
          <Route path="/?g=:id" element={<Home />}/> 
          <Route path="*" element={<Header />} /> 
      </Routes> 
    </Router>
    </ThemeProvider>      
    </>
  )
}

export default App


