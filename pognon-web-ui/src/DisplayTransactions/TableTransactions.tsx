import { Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import moment from "moment";
import React from "react";
import { deleteTransaction } from "../utils/api";
import { columns, Person, Transaction } from "../utils/data";
import SureDialog from "./SureDialog";

interface Props {
    transactions: Transaction[],
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
    participants: Person[],
    hash: string,
}

interface TransactionToDelete {
  hash: string
  transaction?: Transaction,
  index: number
}

function TableTransaction({transactions, setTransactions, participants, hash}: Props) {
  const [openSure, setOpenSure] = React.useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = React.useState<TransactionToDelete>({
    hash: "",
    transaction: undefined,
    index: 0
  })

    function matchName(IDPerson: Number): string | undefined  {
        if (participants[0]) {
            return participants.find(participant => participant.IDPerson === IDPerson)?.Name;
        } else {
            return undefined;
        }
    }

    const handleOpenSure = (transactionToDelete: TransactionToDelete) => {
      setTransactionToDelete(transactionToDelete);
      setOpenSure(true)
    }

    const handleDelete = async () => {
      if (!transactionToDelete.transaction) { return }
      try {
        await deleteTransaction(transactionToDelete.hash, transactionToDelete.transaction);
        transactions.splice(transactionToDelete.index, 1);
        setTransactions([...transactions])
      } catch(err) {
        console.log(err);
      }
    }

    return(
        <Grid item xs={12}>
          <SureDialog 
            openSure={openSure}
            setOpenSure={setOpenSure}
            handleDelete={handleDelete}
            message={
              `Are you sure you want to delete this transaction?`
            }
          />
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
                    {transactions[0] && transactions.map((transaction: Transaction, index) => (
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
                        
                        <Tooltip title={moment(transaction.CreatedAt).calendar()} placement="left" >
                        <TableCell key={transaction.IDTransaction + "date"}>
                          {moment(transaction.CreatedAt).format('L')}
                        </TableCell>
                        </Tooltip>
                            
                        <TableCell key={`${transaction.IDTransaction}-deleteBtn`}>
                          <IconButton aria-label="delete" onClick={_ => handleOpenSure({hash, transaction, index})}>
                              <Delete/>
                          </IconButton>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table></TableContainer></Paper>
        </Grid>
    )
}

export default TableTransaction;