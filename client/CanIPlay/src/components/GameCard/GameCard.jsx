import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Stack, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'

const ServiceOverlay = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  bottom: '0.625rem',
  left: '0.625rem',
  right: '0.625rem',
  justifyContent: 'flex-end',
  padding: '0.25rem',
  borderRadius: '0.5rem',
}));

const GameContainerCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  height: '30rem',
  aspectRatio: '3/4',
  borderRadius: '0.5rem',
  overflow: 'hidden',
  cursor:'pointer',
  '&:hover .MuiCardContent-root': {
    transform: 'translateY(0)',
    opacity: 1,
    
  },
  '&:hover .MuiCardMedia-root:before': {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',

  },
}));


const CardPopup = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  bottom: -2,
  left: -1,
  right: -1,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  width:'100%',
  padding:'0.5rem',
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease, opacity 0.3s ease',
  opacity: 0,
}));

const ChipBubble = styled(Chip)(({ theme }) => ({
  padding: '0.125rem 0.5rem', 
  height: 'auto', 
  borderRadius: '0.75rem', 
  display: 'inline-flex', 
  maxWidth: 'fit-content', 
  fontSize: '0.7rem',
  fontWeight: 400,
  backgroundColor:'rgba(0,0,0,0.3)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'white',
  margin:'400px'
}));


function GameCard({ game }) {
  const theme = useTheme();
  const navigate = useNavigate();
  
const handleClick = (event) =>{
  event.preventDefault();
  navigate(`/game/${game.game_id}`)  
}

  return (
    <GameContainerCard onClick={handleClick}>
      <CardMedia     
        component="img"
        image={game.image}
        alt={game.name}
      />
      <ServiceOverlay direction="column" spacing={1}>
        {game.subscription_services.map((service, index) => (
          <ChipBubble key={index} label={service.name} size="small" />
        ))}
      </ServiceOverlay>
      <CardPopup>
        <Typography variant="h6" color="white" paddingBottom='0.1rem' component="div">
          {game.name}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', marginTop: 1, justifyContent: 'space-evenly', alignContent: 'center', gap: 1 }}>
          {game.genres.map((genre, index) => (
            <ChipBubble key={index} label={genre.name} size="small" />
          ))}
        </Stack>
      </CardPopup>
    </GameContainerCard>
  );
}

export default GameCard;
