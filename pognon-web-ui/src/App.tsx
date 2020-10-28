import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'fontsource-roboto/300.css';
import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';
import 'fontsource-roboto/700.css';
import './App.css';

import moment from 'moment';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteComponentProps
} from 'react-router-dom';

import { AppBar, Card, Toolbar, Grid, Typography, Container, Box, CardContent, 
  CardHeader, Avatar, Paper, Table, TableCell, TableRow, TableHead, TableBody,
  TableContainer } from '@material-ui/core';
import { FetchData } from './utils/fetchData';
import { Transaction, Person, columns } from './utils/data';
import { calcDebt } from './utils/calculation';
import AddTransaction from './AddTransactionDialog/AddTransaction'

function App() {
  const [participants, setParticipants] = useState<Person[]>(Object);
  const [transactions, setTransactions] = useState<Transaction[]>(Object);
  const [participantsNames, setParticipantsNames] = useState<Map<number,string>>(new Map());

  async function fetch(hash: string) { 
    try {
      const data = await FetchData(hash) ;
      if (data.Transactions) {
        setTransactions(data.Transactions);
      }
      const personsDebts = calcDebt(data.Participants, data.Transactions);
      setParticipants(personsDebts)
      setParticipantsNames(matchNames(data.Participants))
    } catch (err) {
      console.log(err);
    }
  };

  function matchNames(participants: Person[]): Map<number,string> {
    const participantsMap = new Map();
    participants.forEach(participant => {
      participantsMap.set(participant.IDPerson,participant.Name);
    })
    return participantsMap;
  }

  type TParams = { hash: string };

  function GetPognon({ match }: RouteComponentProps<TParams>) {
    if (!participants[0]) {
      fetch(match.params.hash)
    }
    return <div></div>
  };

  return (
    <React.Fragment><CssBaseline>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="title">
            Pognon_ts
          </Typography>
          <AddTransaction participants={participants}/>
        </Toolbar>
      </AppBar>
      <Container className="container"><Box mt={2}>
          <Grid container spacing={3}>
            {participants[0] && participants.map((person: Person) => (
              <Grid key={person.Name} item xs={3}>
                <Card key={person.Name}>
                <CardHeader key={person.Name}
                  avatar={<Avatar aria-label="person">{person.Name[0]}</Avatar>}
                  title={<Typography variant="h5">{person.Name}</Typography>}
                >
                </CardHeader>
                <CardContent>
                  <Typography variant="body1">Debt: {person.Debt.toFixed(2)}€</Typography>
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
                        <TableCell key={transaction.IDTransaction + "buyers"}>
                          {transaction.Buyers.map(buyer => 
                            participantsNames.get(buyer.IDPerson)).join(", ")}</TableCell>
                        <TableCell key={transaction.IDTransaction + "amount"}>
                          {transaction.Buyers[0].Amount}</TableCell>
                        <TableCell key={transaction.IDTransaction + "for"}>
                          {transaction.For.map(forWho => 
                            participantsNames.get(forWho.IDPerson)).join(", ")}</TableCell>
                        <TableCell key={transaction.IDTransaction + "reason"}>
                          {transaction.Reason}</TableCell>
                        <TableCell key={transaction.IDTransaction + "date"}>
                          {moment(transaction.CreatedAt).fromNow()}</TableCell>
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
      <Router>
        <Switch>
          <Route path="/:hash" component={GetPognon}/>
        </Switch>
      </Router>
    </CssBaseline></React.Fragment>
  );
}

export default App;
