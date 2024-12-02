import React, {useState} from 'react'
import { AppBar, Toolbar, Typography, Box, InputBase,useTheme } from "@mui/material"; 
import { useNavigate, } from 'react-router-dom'



  
  
function Header({searchQuery}) {
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
    <Toolbar sx={{ display: 'flex', flexDirection:{xs:'column',lg:'row'}, justifyContent: 'space-between', alignItems: 'center', paddingBottom: '3rem', paddingTop: '3rem', position: 'relative' }}>
      <Box sx={{ flexGrow: 1 }} />
      <Typography onClick={handleLogoClick} variant="h2" sx={{ "&:hover": { cursor: 'pointer' },fontStyle:'italic', ...logoStyle }}>
        Can I Play It?
      </Typography>
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <form onSubmit={handleSearchSubmit}>
          <Box className="Search" sx={{ position: 'relative', borderRadius: '0.25rem', backgroundColor: 'accent.main', '&:hover': { backgroundColor: 'accent.light' }, marginRight: 0, marginLeft: 0, width: '100%', '@media (min-width:600px)': { marginLeft: (theme) => theme.spacing(3), width: 'auto' } }}>
            <InputBase sx={{ color: 'inherit', '& .MuiInputBase-input': { padding: 1, transition: (theme) => theme.transitions.create('width'), width: '100%', '@media (min-width:960px)': { width: '20rem' } } }}
              placeholder="Search..."
              value={query}
              onChange={handleSearchUpdate}
            />
          </Box>
        </form>
      </Box>
    </Toolbar>
    {searchQuery ?
      <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h5" sx={{ whiteSpace: 'pre-wrap' }}>
          {`Search results for `}
        </Typography>
        <Typography variant="h5" sx={{ fontStyle: 'italic' }}>
          {searchQuery}
        </Typography>
      </Toolbar>
      : <></>}
  </AppBar>
);
}

export default Header;
