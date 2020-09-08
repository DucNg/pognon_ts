import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'fontsource-roboto/300.css';
import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';
import 'fontsource-roboto/700.css';

import moment from 'moment';

import { AppBar, Card, Toolbar, Grid, Typography, Container, Box, CardContent, 
  CardHeader, Avatar, Paper, Table, TableCell, TableRow, TableHead, TableBody,
  TableContainer } from '@material-ui/core';
import { FetchData } from './FetchData';
import { Transaction, columns } from './Data';

function App() {
  const [pognon, setPognon] = useState(Object);
  const [transactions, setTransactions] = useState(Object)

  useEffect(() => {
    async function fetch() { 
      try {
        const data = await FetchData("abcdefgh") ;
        setPognon(data.Pognon);
        setTransactions(data.Transactions);
      } catch (err) {
        console.log(err);
      }
    };
    if (!pognon.Participants) {
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
      <Container className="container"><Box mt={2}>
          <Grid container spacing={3}>
            {pognon.Participants && pognon.Participants.map((person: string) => (
              <Grid key={person} item xs={3}>
                <Card key={person}>
                <CardHeader key={person}
                  avatar={<Avatar aria-label="person">{person[0]}</Avatar>}
                  title={<Typography variant="h5">{person}</Typography>}
                >
                </CardHeader>
                <CardContent>
                  <Typography variant="body1">Amount payed: 0€</Typography>
                  <Typography variant="body2">Owe 25€ to Lorem</Typography>
                </CardContent>
                </Card>
              </Grid>))}
              <Grid item xs={12}>
                <Paper><TableContainer><Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions[0] && transactions.map((transaction: Transaction) => (
                      <TableRow hover key={transaction.IDTransaction}>
                        <TableCell key={transaction.IDTransaction + "buyers"}>{transaction.Buyers.map(e => e.Person)}</TableCell>
                        <TableCell key={transaction.IDTransaction + "amount"}>{transaction.Buyers[0].Amount}</TableCell>
                        <TableCell key={transaction.IDTransaction + "for"}>{transaction.For.map(e => e.Person)}</TableCell>
                        <TableCell key={transaction.IDTransaction + "reason"}>{transaction.Reason}</TableCell>
                        <TableCell key={transaction.IDTransaction + "date"}>{moment(transaction.CreatedAt).fromNow()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table></TableContainer></Paper>
              </Grid>
          </Grid>
        </Box></Container>

      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />  
    </CssBaseline></React.Fragment>
  );
}

export default App;
