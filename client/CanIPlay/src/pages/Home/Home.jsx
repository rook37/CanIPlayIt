import React from "react";
import Gallery from "/src/components/Gallery/Gallery";
import Header from "../../components/Header/Header";
import Navbar from "../../components/Navbar/Navbar";
import { Container, useTheme, Box } from "@mui/material";


function Home() {
  const theme = useTheme()

  return (
    <>
   <Box sx={{ bgcolor: theme.palette.background.background, minHeight: "100vh"}}>
      <Header/>
      <Navbar/>
      <Container maxWidth='xl' sx={{bgcolor:theme.palette.background.default,height:"100%"}}>
      <Gallery />
      </Container>
      </Box>
    </>
  );
}

export default Home;
