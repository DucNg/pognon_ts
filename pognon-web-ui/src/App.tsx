import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'fontsource-roboto/300.css';
import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';
import 'fontsource-roboto/700.css';

import { AppBar, Card, Toolbar, Grid, Typography, Container, Box, CardContent } from '@material-ui/core';
import { FetchData } from './FetchData';

function App() {
  const [pognon, setPognon] = useState(Object);
  const [participants, setParcitipants] = useState("");

  useEffect(() => {
    async function fetch() { 
      try {
        const data = await FetchData("abcdefgh") ;
        setPognon(data.Pognon);
        const listItems = pognon.Participants.map((person: string) =>
        <Grid key={person} item xs={3}>
          <Card key={person}>
          <CardContent key={person}>
            <Typography key={person}>{person}</Typography>
          </CardContent>
          </Card>
        </Grid>
      );
        setParcitipants(listItems);
      } catch (err) {
        console.log(err);
      }
    };
    if (!participants) {
      fetch();
    }
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
            {participants}
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
