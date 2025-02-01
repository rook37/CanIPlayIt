import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { Container, useTheme, Box, Card, CardMedia, Chip, CardContent, Typography } from "@mui/material";
import { useParams, useNavigate, Link } from 'react-router-dom'
import { styled } from '@mui/system';
import axios from 'axios'

const GamePageContainer = styled(Container)(({theme})=>({
  display: "flex",
  marginTop: "3rem",
  margin: '1.5rem 0 0 0',
  padding: '0',
  flexDirection: 'column',
  justifyContent: 'center', alignContent: 'center', alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  height: "auto", borderRadius: '0.5rem',
  [theme.breakpoints.up('lg')]:{
    flexDirection:"row" ,
    margin:'1.5rem auto auto auto',
    padding:'auto'
  }

}))

const GameArtAndGenresBox = styled(Box)(({theme})=>({
  margin:  '0',
   display: 'flex', 
   flexDirection: 'column', 
   alignContent: 'center', 
   alignItems: 'center',
    justifyContent: 'center', 
    height: 'auto', 
    width:'100%', 
    [theme.breakpoints.up('lg')]:{
      width:'50%',
      margin: '1.5rem'
    }
  

}))

const GameCoverArtCard = styled(Card)(({theme})=>({
    display: "flex",
    flexDirection: "column",
    margin:'1.5rem',
    marginBottom: '0.5rem',
    backgroundColor: theme.palette.background.default,
    aspectRatio: '3/4',
    maxHeight:'364px', 
    height: '364px',
    maxWidth: '273px',
    width:'273px', 
    [theme.breakpoints.up('lg')]:{
      maxHeight:'472px',
      height:'472px',
      maxWidth:'354px',
      width:'354px',
      margin:'2.5rem'
    }

}))

const GameCoverArt = styled(CardMedia)(({})=>({
    objectFit: "cover",
    aspectRatio: '3/4',
    borderRadius: "0.5rem 0.5rem 0 0",
    maxHeight: 'inherit',
    maxWidth: 'inherit',
    height: 'inherit',
    width: 'inherit',
}))

const GenreBox = styled(CardContent)(({})=>({
  display: "flex",
  justifyContent: "center", 
  alignContent: 'center', 
  alignItems: 'center',
  flexWrap: "wrap",
  width: 'calc(100% - 5rem)'
}))

const GenreChip = styled(Chip)(({theme}) => ({
	backgroundColor: theme.palette.accent.light,
	marginTop: 1,
	marginBottom: 0.5,
	marginLeft: 0.4,
	maxWidth: '12.5rem',
	fontSize: '0.75rem',
	fontWeight: 400,
	textTransform: 'uppercase',
	letterSpacing: '0.1rem',
	flexGrow: 1,
	color: theme.palette.background.default,
	flexShrink: 0,
}));

const SubInfoBox =  styled(Box)(({theme})=>({
  width: '100%',
  backgroundColor: theme.palette.primary.main, 
   padding: '2rem',
    paddingTop: '0rem' 
}))

const GameInfoBox = styled(Box)(({game, theme})=>({
  display: 'flex', 
  flexDirection: 'column',
   alignContent: 'center',
    margin: '1.5rem 0',
    marginTop: `${10 - Math.ceil((game.description.length - 1000) / 200)}rem`, 
    width:  '90%',
    [theme.breakpoints.up('lg')]:{
      margin: '3rem 3rem 3rem 1.5rem',
      width:'50%' 
    }
}))

const SubAction = styled(Typography, { shouldForwardProp: (prop) => prop !== 'getbg' && prop !== 'service' })
  (({ theme, getbg, service }) => ({
  '&:hover':{
    cursor:'pointer', 
    color:theme.palette.common.white
  },
  color: `${getbg(service.name).text}`, 
  textShadow: theme.typography.smallShadow, 
  marginTop: '0.5rem' 
}))

function GamePage() {
  const theme = useTheme()
  const navigate = useNavigate();
  const param = useParams()
  const [game, setGame] = useState(null)
  let gameId = param.gameId;

  useEffect(() => {
    const populateGame = async () => {
      try {
        let res = await axios.get(`${process.env.REACT_APP_API_URL}:8080/game/${gameId}`)
        setGame(res.data.game[0])
      } catch (er) {
        console.log(`Error retrieving info for ${gameId}.\n ${er}`)
      }
    }
    populateGame();
  }, [])

  const handleId = (type, id) => {

    navigate(`/?${type}=${id}`)
  }


  const handleSignup = (name) => { //update for individual services.
    if (name.includes('PS')) {
      return 'https://www.playstation.com/en-us/ps-plus/'
    } else if (name.includes('Game')) {
      return 'https://www.xbox.com/en-us/xbox-game-pass?xr=shellnav'
    } else if (name.includes('EA')) { return 'https://www.ea.com/en-ca/ea-play' }
    else { return 'https://store.ubisoft.com/us/ubisoftplus/ubisoft-plus.html?lang=en_US' }
  }

  const getBG = (name) => {
    if (name.includes('PS')) {
      return theme.palette.ps
    } else if (name.includes('Game')) {
      return theme.palette.xbox
    } else if (name.includes('EA')) { return theme.palette.ea }
    else { return theme.palette.ubi }
  }


  const studios = (isMobile) => {
    let disp = (isMobile) ? { display: { xs: 'flex', lg: 'none' }, marginTop: '2rem' } : { display: { xs: 'none', lg: 'flex' } }

    return (<Box sx={{ ...disp, flexDirection: 'column' }}>
      <Typography variant='button' sx={{ textShadow: theme.typography.smallShadow, color: '#dedede', fontSize: '3rem', marginBottom: 0, paddingBottom: 0, lineHeight: '3rem' }}>{game.name}</Typography>
      <Typography gutterBottom variant="overline" sx={{ color: theme.palette.accent.light, fontSize: '1rem', textShadow: theme.typography.smallShadow, }}>{game.developers.map((dev, index) => (
        <span key={index}>{dev.name} {index < game.developers.length - 1 ? ' / ' : ''}</span>
      ))} <br></br> {game.publishers.map((pub, index) => (
        <span key={index}>{pub.name} {index < game.publishers.length - 1 ? ' / ' : ''}</span>
      ))}</Typography>
    </Box>)
  }

  return (
    <>
      {game ? (
        <Box
          sx={{
            bgcolor: theme.palette.background.background,
            minHeight: "100vh",
          }}>
          <Header />
          <GamePageContainer maxWidth="xl">
            {studios(true)}
            <GameArtAndGenresBox >
              <GameCoverArtCard>
                <GameCoverArt 
                  component="img"
                  image={game.image}
                  alt={game.name}
                />
              </GameCoverArtCard>
              <GenreBox>
                {game.genres.map((genre, index) => (
                  <GenreChip  key={index} label={genre.name} size="small"  onClick={() => handleId('g', genre.genre_id)} />))}
              </GenreBox>
              <SubInfoBox>
                <Typography variant="overline" sx={{ margin: '2rem', fontSize: '1.5rem', lineHeight: '5rem', color: theme.palette.accent.light, textShadow: theme.typography.invSmallShadow }}>AVAILABLE ON</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                  {game.subscription_services.map((service, index) => (
                    <Card className="subscription-service" key={index} sx={{ display: 'flex', flexDirection: 'column', minWidth: '15rem', bgcolor: `${getBG(service.name).dark}5f`, borderRadius: '0.5rem' }}>
                      <Card className="subscription-actions" sx={{ width: '100%', height: 'auto', alignContent: 'center', bgcolor: `${getBG(service.name).darker}` }}>
                        <Typography variant='button' sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', color: `${getBG(service.name).text}`, fontSize: '1rem', lineHeight: '2rem' }}>{service.name}</Typography></Card>
                      <SubAction getbg={getBG} service={service}  variant='overline'onClick={() => handleId('s', service.service_id)}>See all games</SubAction>
                      <SubAction getbg={getBG} service={service} variant='overline' component={Link} to={handleSignup(service.name)} >Sign up</SubAction>
                    </Card>
                  ))}
                </Box>
              </SubInfoBox>
            </GameArtAndGenresBox>
            <GameInfoBox game={game}  >
              {studios(false)}
              <Card className="description" sx={{ textAlign: 'left', width: '100%', bgcolor: theme.palette.secondary.main, padding: '2rem', paddingTop: '0.5rem' }}>
                <Typography variant="caption" sx={{ fontSize: '0.9rem', lineHeight: '2rem', fontStyle: 'italic', color: theme.palette.primary.main, textShadow: theme.typography.invSmallShadow }}>description</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.89rem', lineHeight: '1.5rem', whiteSpace: 'pre-wrap', color: 'white', textShadow: theme.typography.smallShadow }}>{game.description}</Typography>
              </Card>

            </GameInfoBox>
          </GamePageContainer>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}

export default GamePage;
