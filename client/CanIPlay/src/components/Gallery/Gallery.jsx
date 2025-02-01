import React, { useState, useEffect } from 'react';
import Grid2 from '@mui/material/Grid2';
import GameCard from '/src/components/GameCard/GameCard';
import Pagination from '@mui/material/Pagination';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Box, Typography, useTheme, styled } from '@mui/material';


const GalleryPages = styled(Pagination)(({ theme }) => ({
  paddingBottom:'1rem',
  marginTop: '1rem', 
  display: 'flex', 
  justifyContent: 'center',
  '& .MuiPaginationItem-root': {
    color: theme.palette.common.white,
    '&.Mui-selected': {
      backgroundColor: theme.palette.accent.light,
      color: theme.palette.common.white,
    }
  }
}));

const GameGallery = styled(Grid2)(() => ({
  display: 'flex', 
  justifyContent: 'space-evenly', 
  paddingTop: '1rem', 
  width: '100%' 

}))

const GameCardItem = styled(Grid2)(() => ({
  display: 'flex', 
  justifyContent: 'center', 
  margin: '1rem 0'  
}))


const SearchResultHeaderText = styled(Typography)(({theme})=>({
   color: theme.palette.common.offwhite, 
   fontSize: '2rem', 
   fontStyle: 'italic', 
   paddingTop: '3rem' 
}))

const NoResultsText = styled(Typography)(({theme})=>({ 
  color: theme.palette.accent.light, 
  fontStyle: 'italic', 
  fontSize: '3rem' 
}))


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
			let res = await axios.get('process.env.API_URL:8080/games', {
				params: {
					q: searchQuery,
					p: platforms,
					g: genre,
					s: service,
					page: page,
					limit: 20,
				},
			});
			setGames(res.data.games);
			setTotalPages(res.data.pagination.totalPages);
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
			{searchQuery ? (
				<SearchResultHeaderText variant='h4'>
					Displaying {games.length} results for "{searchQuery}"
				</SearchResultHeaderText>
			) : (
				<></>
			)}
			{games && totalPages ? (
				<>
					<GameGallery container spacing={0} columns={{ xs: 3, sm: 9, lg: 12 }}>
						{games.map((game) => (
							<GameCardItem item size={3} key={game.game_id}>
								<GameCard game={game} />
							</GameCardItem>
						))}
					</GameGallery>
					<GalleryPages count={totalPages} page={page} onChange={handlePageChange} showFirstButton showLastButton/>
				</>
			) : (
				<Box sx={{ height: '15rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<NoResultsText variant='h7' >
						No results
					</NoResultsText>
				</Box>
			)}
		</>
	);
}

export default Gallery;
