import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useTheme
} from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const servicesRes = await axios.get('http://localhost:8080/services');
      const platsRes = await axios.get('http://localhost:8080/platforms');
      const gensRes = await axios.get('http://localhost:8080/genres');

      setServices(servicesRes.data);
      setPlatforms(platsRes.data);
      setGenres(gensRes.data);
    };

    fetchData();
  }, []);

  const handleSelection = (param, value) => {
    const paramsArray = urlParams.getAll(param);
    if (paramsArray.includes(value)) {
      urlParams.delete(param);
      paramsArray.forEach(val => {
        if (val !== value) urlParams.append(param, val);
      });
    } else {
      urlParams.append(param, value);
    }
    navigate({ search: urlParams.toString() });
  };

  const isSelected = (param, value) => {
    const paramsArray = urlParams.getAll(param);
    return paramsArray.includes(value);
  };

  const customCheckboxStyle = {
    '& .MuiSvgIcon-root': {
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      color:'grey'
    },
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.background.background, padding: '1rem', height: '25rem',borderBottom:1,borderTop:1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between',alignItems:'flex-start' }}>
        <Box sx={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: {xs:'column',md:'column'} }}>
          <Typography variant="h6" gutterBottom>Services</Typography>
          <Box sx={{ display: 'flex', overflow: 'auto', flex: 1, justifyContent:'space-evenly' }}>
    
              <FormGroup sx={{ ...customCheckboxStyle }}>
                {services.filter(service => service.name.toLowerCase().includes('game pass')).map((service) => (
                  <FormControlLabel
                    key={service.service_id}
                    control={
                      <Checkbox
                        sx={customCheckboxStyle}
                        checked={isSelected('s', service.service_id.toString())}
                        onChange={() => handleSelection('s', service.service_id.toString())}
                      />
                    }
                    label={<Typography variant='overline'sx={{fontSize:'1rem'}}>{service.name}</Typography>}
                  />
                ))}
              </FormGroup>
    
              <FormGroup sx={{ ...customCheckboxStyle }}>
                {services.filter(service => !service.name.toLowerCase().includes('game pass')).map((service) => (
                  <FormControlLabel 
                    key={service.service_id}
                    control={
                      <Checkbox
                        sx={customCheckboxStyle}
                        checked={isSelected('s', service.service_id.toString())}
                        onChange={() => handleSelection('s', service.service_id.toString())}
                      />
                    }
                    label={<Typography variant='overline' sx={{fontSize:'1rem'}}>{service.name}</Typography>}
                 
                  />
                ))}
              </FormGroup>
         
          </Box>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', display: {xs:'none',md:'flex'}, flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>Platforms</Typography>
          <Box sx={{ overflow: 'auto', flex: 1 }}>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', ...customCheckboxStyle }}>
              {platforms.map((platform) => (
                <FormControlLabel
                  key={platform.platform_id}
                  control={
                    <Checkbox
                      sx={customCheckboxStyle}
                      checked={isSelected('p', platform.platform_id.toString())}
                      onChange={() => handleSelection('p', platform.platform_id.toString())}
                    />
                  }
                  label={<Typography variant='overline'sx={{fontSize:'1rem'}}>{platform.name}</Typography>}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center', display: {xs:'none',xl:'flex'}, flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>Genres</Typography>
          <Box sx={{ overflow: 'auto', flex: 1 }}>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', ...customCheckboxStyle }}>
              {genres.map((genre) => (
                <FormControlLabel
                  key={genre.genre_id}
                  control={
                    <Checkbox
                      sx={customCheckboxStyle}
                      checked={isSelected('g', genre.genre_id.toString())}
                      onChange={() => handleSelection('g', genre.genre_id.toString())}
                    />
                  }
                  label={<Typography variant='overline'sx={{fontSize:'0.7rem'}}>{genre.name}</Typography>}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
