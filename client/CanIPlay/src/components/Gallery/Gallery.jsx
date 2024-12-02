import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import GameCard from '/src/components/GameCard/GameCard';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Box, Typography, useTheme } from "@mui/material";

function Gallery() {
  const theme = useTheme();
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const searchQuery = urlParams.get('q'); 
  const platforms = urlParams.getAll('p'); 
  const genre = urlParams.getAll('g'); 
  const service = urlParams.getAll('s'); 

  const populateGames = async () => {
    try {
      let res = await axios.get('http://localhost:8080/games', {
        params: {
          q: searchQuery,
          p: platforms,
          g: genre,
          s: service,
          page: page,
          limit: 20
        }
      });
      setGames(res.data.games);
      setTotalPages(res.data.pagination.totalPages);;
    } catch (er) {
      console.log(er);
    }
  };

  useEffect(() => {
    populateGames();
  }, [page, searchQuery, location.search]);


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
    {(searchQuery)? <Typography variant='h4' sx={{color:theme.palette.common.offwhite,fontSize:'2rem',fontStyle:'italic',paddingTop:'3rem'}}>Displaying {games.length} results for "{searchQuery}" </Typography> : <></>}
      {(games && totalPages) ? (
        <>
        
          <Grid2 container spacing={0} columns={{xs:3, sm:9, lg:12}} style={{ display:'flex', justifyContent:'space-evenly',paddingTop: '1rem',width:'100%' }}>
            {games.map((game) => (
              <Grid2 item size={3}  key={game.game_id} sx={{display:'flex',justifyContent:'center', margin:'1rem 0'}}>
                <GameCard game={game} />
              </Grid2>
            ))}
          </Grid2>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange} 
            showFirstButton
            showLastButton
            sx={{
              paddingBottom:'1rem', marginTop: '1rem', display: 'flex', justifyContent: 'center',
              '& .MuiPaginationItem-root': {
                color: theme.palette.common.white,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.accent.light,
                  color: theme.palette.common.white,
                },
              },
            }}
          />
        </>
      ) : (
        <Box sx={{height:'15rem',display:'flex',alignItems:'center',justifyContent:'center'}}><Typography variant='h7' sx={{color:theme.palette.accent.light,fontStyle:'italic',fontSize:'3rem'}}>No results</Typography></Box>
      )}
    </>
  );
}

export default Gallery;
