import React, { useState, useEffect } from "react";
import {  AppBar,  Toolbar,  Box,  Typography,  FormGroup,  FormControlLabel,  Checkbox,  useTheme,styled} from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl=import.meta.REACT_APP_API_URL

const NavCheckbox = styled(Checkbox)(()=>({
  '& .MuiSvgIcon-root': {
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    color:'grey'
  }
})) 

const NavSectionBox = styled(Box)(()=>({
  flex: 1, 
  textAlign: 'center', 
  flexDirection:'column',
  alignContent:'center',
  alignItems:'center',
  justifyContent:'center'
}))

function Navbar() {
  const theme = useTheme();
  const [services, setServices] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [genres, setGenres] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchData = async () => {
      const servicesRes = await axios.get(`https://api.caniplayit.com:8080/services`);
      const platsRes = await axios.get(`https://api.caniplayit.com:8080/platforms`);
      const gensRes = await axios.get(`https://api.caniplayit.com:8080/genres`);

      setServices(servicesRes.data);
      setPlatforms(platsRes.data);
      setGenres(gensRes.data);
    };

    fetchData();
  }, []);

  const handleSelection = (param, value) => {
    const params = urlParams.getAll(param);
    if (params.includes(value)) {
      urlParams.delete(param);
      params.forEach(val => {
        if (val !== value) urlParams.append(param, val);
      });
    } else {
      urlParams.append(param, value);
    }
    navigate({ search: urlParams.toString() });
  };

  const isSelected = (param, value) => {
    const params = urlParams.getAll(param);
    return params.includes(value);
  };

  

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.background.background, padding: '0.5rem', height: '26.5rem',borderBottom:1,borderTop:1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-evenly',alignItems:'flex-start',marginLeft:'1rem',marginRight:'1rem' }}>
        <NavSectionBox sx={{ display: 'flex',paddingTop:'2rem' }}>
          <Typography variant="h6" gutterBottom>Services</Typography>
          <Box sx={{ display: 'flex', overflow: 'auto', flex: 1, justifyContent:'space-evenly' }}>
              <FormGroup >
                {services.filter(service => service.name.toLowerCase().includes('game pass')).map((service) => (
                  <FormControlLabel
                    key={service.service_id}
                    control={
                      <NavCheckbox      
                        checked={isSelected('s', service.service_id.toString())}
                        onChange={() => handleSelection('s', service.service_id.toString())}
                      />
                    }
                    label={<Typography variant='overline'sx={{fontSize:'1rem'}}>{service.name}</Typography>}
                  />
                ))}
              </FormGroup>   
              <FormGroup>
                {services.filter(service => !service.name.toLowerCase().includes('game pass')).map((service) => (
                  <FormControlLabel 
                    key={service.service_id}
                    control={
                      <NavCheckbox  
                        checked={isSelected('s', service.service_id.toString())}
                        onChange={() => handleSelection('s', service.service_id.toString())}
                      />
                    }
                    label={<Typography variant='overline' sx={{fontSize:'1rem'}}>{service.name}</Typography>}                 
                  />
                ))}
              </FormGroup>        
          </Box>
        </NavSectionBox>
        <NavSectionBox sx={{  display: {xs:'none',md:'flex'},paddingTop:'2rem' }}>
          <Typography variant="h6" gutterBottom>Platforms</Typography>
          <Box sx={{ overflow: 'auto', flexShrink:1}}>
            <FormGroup sx={{ display: 'flex', flexDirection:{lg:'column'}, alignContent:'center',flexWrap: 'wrap', justifyContent: 'center' }}>
              {platforms.map((platform) => (
                <FormControlLabel
                  key={platform.platform_id}
                  control={
                    <NavCheckbox
                      checked={isSelected('p', platform.platform_id.toString())}
                      onChange={() => handleSelection('p', platform.platform_id.toString())}
                    />
                  }
                  label={<Typography variant='overline'sx={{fontSize:'1rem'}}>{platform.name}</Typography>}
                />
              ))}
            </FormGroup>
          </Box>
        </NavSectionBox>
        <NavSectionBox sx={{ display: {xs:'none',xl:'flex'},overflow:'auto',height:'25rem'}}>
          <Typography variant="h6" gutterBottom>Genres</Typography>
          <Box sx={{ overflow: 'auto', flex: 1 }}>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',overflow:'auto'}}>
              {genres.map((genre) => (
                <FormControlLabel
                  key={genre.genre_id}
                  control={
                    <NavCheckbox
                      checked={isSelected('g', genre.genre_id.toString())}
                      onChange={() => handleSelection('g', genre.genre_id.toString())}
                    />
                  }
                  label={<Typography variant='overline'sx={{fontSize:'0.7rem'}}>{genre.name}</Typography>}
                />
              ))}
            </FormGroup>
          </Box>
        </NavSectionBox>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
