import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'fontsource-roboto/300.css';
import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';
import 'fontsource-roboto/700.css';

import { AppBar, Button, Toolbar, Grid, Typography, Container, Box } from '@material-ui/core';
import { FetchData } from './FetchData';

function App() {
  const [pognon, setPognon] = useState("");

  useEffect(() => {
    async function fetch() { 
      try {
        const data = await FetchData("abcdefgh") 
        setPognon(data.Pognon.IDPognon.toString())
      } catch (err) {
        console.log(err)
      }
    };
    fetch();
  });

  return (
    <React.Fragment><CssBaseline>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="title">
            Pognon_ts
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className="container">
        <Box mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Button variant="contained" color="primary">Hello world</Button>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              <Typography variant="body1">{pognon}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />  
    </CssBaseline></React.Fragment>
  );
}

export default App;
