import React, {useState} from 'react'
import { AppBar, Toolbar, Typography, Box, InputBase,useTheme,styled} from "@mui/material"; 
import { useNavigate, } from 'react-router-dom'


const HeaderBar = styled(Toolbar)(({theme})=>({
display: 'flex', 
flexDirection:'column',
 justifyContent: 'space-between', 
 alignItems: 'center', paddingBottom: '3rem', 
 paddingTop: '3rem', 
 position: 'relative',
 [theme.breakpoints.up('lg')]:{
  flexDirection:'row'
 }
}))
  
const SearchBox = styled(Box)(({theme})=> ({
 position: 'relative', 
 borderRadius: '0.25rem', 
 backgroundColor: theme.palette.accent.main, 
 '&:hover': { backgroundColor: theme.palette.accent.light }, 
 marginRight: 0, 
 marginLeft: 0, 
 marginTop:'0.75rem',
 paddingTop:'0.25rem',
 paddingBottom:'0.25rem',
 paddingLeft:'0.5rem',
 width: '100%', 
 [theme.breakpoints.up('sm')]: { 
  marginLeft: '0.75rem', 
  width: 'auto' 
 }
}))

const SearchInput = styled(InputBase)(({theme})=> ({
  color: 'inherit', 
  '& .MuiInputBase-input': { 
    padding: 1,
    transition: (theme) => theme.transitions.create('width'), 
    width: '100%', 
     [theme.breakpoints.up('md')]:{ 
      width: '20rem' 
    } }

}))
  
function Header({}) {
  const theme = useTheme();
  const [query, setQuery] = useState('')
  const navigate = useNavigate();


  const logoStyle={
    [theme.breakpoints.up('lg')]:{
      position: 'absolute', left: '50%', transform: 'translateX(-50%)'},
    [theme.breakpoints.up('xs')]:{
        position:'relative'
      }
  }

  const handleLogoClick = (event) => {event.preventDefault();navigate('/')}
  const handleSearchUpdate = (event) => { setQuery(event.target.value); }; 
  const handleSearchSubmit = (event) => { event.preventDefault(); 
    if (query) {
       navigate(`/?q=${query.trim()}`); 
      } }
  
      
return (
  <AppBar position="static" color="primary">
    <HeaderBar>
      <Box sx={{ flexGrow: 1 }} />
      <Typography onClick={handleLogoClick} variant="h2" sx={{ "&:hover": { cursor: 'pointer' },fontStyle:'italic', ...logoStyle }}>
        Can I Play It?
      </Typography>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <form onSubmit={handleSearchSubmit}>
          <SearchBox className="Search">
            <SearchInput 
              placeholder="Search..."
              value={query}
              onChange={handleSearchUpdate}
            />
          </SearchBox>
        </form>
      </Box>
    </HeaderBar>
  </AppBar>
);
}

export default Header;
