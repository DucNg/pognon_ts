import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import moment from "moment";
import React from "react";
import { columns, Person, Transaction } from "../utils/data";

interface Props {
    transactions: Transaction[],
    participants: Person[],
}

function TableTransaction({transactions, participants}: Props) {

    function matchName(IDPerson: Number): string | undefined  {
        if (participants[0]) {
            return participants.find(participant => participant.IDPerson === IDPerson)?.Name;
        } else {
            return undefined;
        }
    }

    return(
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
                            matchName(buyer.IDPerson)).join(", ")}</TableCell>
                        <TableCell key={transaction.IDTransaction + "amount"}>
                          {transaction.Buyers.reduce((prevValue, buyer) => 
                              prevValue + buyer.Amount, 0)}</TableCell>
                        <TableCell key={transaction.IDTransaction + "for"}>
                          {transaction.For.map(forWho => 
                            matchName(forWho.IDPerson)).join(", ")}</TableCell>
                        <TableCell key={transaction.IDTransaction + "reason"}>
                          {transaction.Reason}</TableCell>
                        <TableCell key={transaction.IDTransaction + "date"}>
                          {moment(transaction.CreatedAt).fromNow()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table></TableContainer></Paper>
        </Grid>
    )
}

export default TableTransaction;