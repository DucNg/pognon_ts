import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'fontsource-roboto/300.css';
import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';
import 'fontsource-roboto/700.css';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  RouteComponentProps, Redirect
} from 'react-router-dom';

import { AppBar, Toolbar, Typography, Container, CircularProgress } from '@material-ui/core';
import { fetchData } from './utils/api';
import { Transaction, Person } from './utils/data';
import { calcDebt } from './utils/calculation';
import AddTransaction from './AddTransactionDialog/AddTransaction'
import ParticipantsCards from './DisplayTransactions/ParticipantsCards';
import TableTransaction from './DisplayTransactions/TableTransactions';
import HomePage from './HomePage';

function App() {
  const [pognonHash, setPognonHash] = useState("");
  const [participants, setParticipants] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingStatus, setLoadingStatus] = useState("loading");
  

  async function fetch(hash: string) { 
    try {
      const data = await fetchData(hash);
      setLoadingStatus("done");
      if (data.Transactions) {
        setTransactions(data.Transactions);
      }
      const personsDebts = calcDebt(data.Participants, data.Transactions as Transaction[]);
      setParticipants(personsDebts);
      setPognonHash(hash);
    } catch (err) {
      console.log(err);
      setLoadingStatus("error");
    }
  };

  type TParams = { hash: string };

  function GetCreatePognon() {
    return(
      <HomePage/>
    )
  }

  function GetPognon({ match }: RouteComponentProps<TParams>) {
    if (!participants[0]) {
      try {
        fetch(match.params.hash);
      } catch {
        return <div></div>
      }
    }
    return (
      <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className="title">
            Pognon_ts
          </Typography>
          <AddTransaction 
            pognonHash={pognonHash} 
            participants={participants}
            setParticipants={setParticipants}
            transactions={transactions}
            setTransactions={setTransactions}
          />
        </Toolbar>
      </AppBar>
      <Container className="container">
          <ParticipantsCards participants={participants}/>
          <TableTransaction transactions={transactions} participants={participants}/>
          {loadingStatus === "loading" &&
            <CircularProgress/>
          }
          {loadingStatus === "error" &&
            <Redirect to={{pathname: "/"}} />
          }
      </Container>
      
      </React.Fragment>
    )
  };

  return (
    <React.Fragment><CssBaseline>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />  
      <Router>
        <Switch>
          <Route path="/:hash" component={GetPognon}/>
          <Route path="/" component={GetCreatePognon}/>
        </Switch>
      </Router>
    </CssBaseline></React.Fragment>
  );
}

export default App;
