import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { Container, useTheme, Box, Card, CardMedia, Chip, CardContent, Typography } from "@mui/material";
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

function GamePage() {
  const theme = useTheme()
  const navigate = useNavigate();
  const param = useParams()
  const [game, setGame] = useState(null)
  let gameId = param.gameId;

  useEffect(() => {
    const populateGame = async () => {
      try {
        let res = await axios.get(`http://localhost:8080/game/${gameId}`)
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
          }}
        >
          <Header />
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              marginTop: "3rem",
              margin: { xs: '3rem 0 0 0', lg: '3rem auto auto auto' },
              padding: { xs: '0', lg: 'auto' },
              flexDirection: { xs: 'column', lg: "row" },
              justifyContent: 'center', alignContent: 'center', alignItems: 'center',
              bgcolor: theme.palette.background.default,
              height: "auto", borderRadius: '0.5rem'
            }}
          >
            {studios(true)}
            <Box className="gameArtandgenres" sx={{ margin: { xs: '0', lg: '1.5rem' }, display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center', height: 'auto', width: { xs: '100%', lg: '50%' } }}>
              <Card className="cover-art-card" raised='true'
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  margin: { xs: '1.5rem', lg: '2.5rem' },
                  marginBottom: '0.5rem',
                  bgcolor: theme.palette.background.default,
                  aspectRatio: '3/4',
                  maxHeight: { xs: '364px', lg: '472px' },
                  height: { xs: '364px', lg: '472px' },
                  maxWidth: { xs: '273px', lg: '354px' },
                  width: { xs: '273px', lg: '354px' },
                }}>
                <CardMedia className="cover-art"
                  component="img"
                  image={game.image}
                  alt={game.name}
                  sx={{
                    objectFit: "cover",
                    aspectRatio: '3/4',
                    borderRadius: "0.5rem 0.5rem 0 0",
                    maxHeight: 'inherit',
                    maxWidth: 'inherit',
                    height: 'inherit',
                    width: 'inherit',

                  }}
                />
              </Card>
              <Box className="genres" sx={{
                display: "flex",
                justifyContent: "center", alignContent: 'center', alignItems: 'center',
                flexWrap: "wrap",
                width: 'calc(100% - 5rem)'
              }}>
                {game.genres.map((genre, index) => (
                  <Chip className="genre" key={index} label={genre.name} size="small" sx={{ backgroundColor: theme.palette.accent.light, marginTop: 1, marginBottom: 0.5, marginLeft: 0.4, maxWidth: "12.5rem", fontSize: "0.75rem", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.1rem", flexGrow: 1, color: theme.palette.background.default, flexShrink: 0, }} onClick={() => handleId('g', genre.genre_id)} />))}
              </Box>
              <Box className="subInfo" sx={{ width: '100%', bgcolor: theme.palette.primary.main, padding: '2rem', paddingTop: '0rem' }}>
                <Typography variant="overline" sx={{ margin: '2rem', fontSize: '1.5rem', lineHeight: '5rem', color: theme.palette.accent.light, textShadow: theme.typography.invSmallShadow }}>AVAILABLE ON</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                  {game.subscription_services.map((service, index) => (
                    <Card className="subscription-service" key={index} sx={{ display: 'flex', flexDirection: 'column', minWidth: '15rem', bgcolor: `${getBG(service.name).dark}5f`, borderRadius: '0.5rem' }}>
                      <Card className="subscription-actions" sx={{ width: '100%', height: 'auto', alignContent: 'center', bgcolor: `${getBG(service.name).darker}` }}>
                        <Typography variant='button' sx={{ paddingLeft: '0.5rem', paddingRight: '0.5rem', color: `${getBG(service.name).text}`, fontSize: '1rem', lineHeight: '2rem' }}>{service.name}</Typography></Card>
                      <Typography variant='overline' sx={{ '&:hover':{cursor:'pointer', color:theme.palette.common.white},color: `${getBG(service.name).text}`, textShadow: theme.typography.smallShadow, marginTop: '0.5rem' }} onClick={() => handleId('s', service.service_id)}>See all games</Typography>
                      <Typography variant='overline' sx={{ '&:hover':{cursor:'pointer', color:theme.palette.common.white},color: `${getBG(service.name).text}`, textShadow: theme.typography.smallShadow, marginTop: '0.5rem' }} component={Link} to={handleSignup(service.name)} >Sign up</Typography>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box className="gameInfo" sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center', margin: { xs: '1.5rem 0', lg: '3rem 3rem 3rem 1.5rem' }, marginTop: `${10 - Math.ceil((game.description.length - 1000) / 200)}rem`, width: { xs: '90%', lg: '50%' } }}>
              {studios(false)}
              <Card className="description" sx={{ textAlign: 'left', width: '100%', bgcolor: theme.palette.secondary.main, padding: '2rem', paddingTop: '0.5rem' }}>
                <Typography variant="caption" sx={{ fontSize: '0.9rem', lineHeight: '2rem', fontStyle: 'italic', color: theme.palette.primary.main, textShadow: theme.typography.invSmallShadow }}>description</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.89rem', lineHeight: '1.5rem', whiteSpace: 'pre-wrap', color: 'white', textShadow: theme.typography.smallShadow }}>{game.description}</Typography>
              </Card>

            </Box>
          </Container>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}

export default GamePage;
