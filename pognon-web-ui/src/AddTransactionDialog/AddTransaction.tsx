import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField, DialogActions, DialogContentText, Box, FormControlLabel, Switch } 
    from '@material-ui/core';

import './AddTransaction.css';

import { ErrorMsg, Person, Transaction } from '../utils/data';
import SelectPersons from './SelectPersons';
import { postTransaction, putTransaction } from '../utils/api';
import { calcDebt } from '../utils/calculation';
import ErrorMessage from '../ErrorMessage';
import { AxiosResponse } from 'axios';

interface Props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    pognonHash: string,
    participants: Person[],
    setParticipants: React.Dispatch<React.SetStateAction<Person[]>>
    transactions: Transaction[],
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
    index?: number
}


const resetTransaction = () => ({
    Buyers: [{IDPerson: -1,Amount: 0, Rest: false}],
    For: [{IDPerson: -1,Amount: 0, Rest: true}],
    Reason: "",
})

function AddTransaction({open, setOpen, pognonHash, participants, setParticipants, transactions, setTransactions, index}: Props) {
    const [isEveryone, setIsEveryone] = useState(true)
    const [transaction, setTransaction] = useState<Transaction>(resetTransaction())

    useEffect(() => {
        if (index === undefined || index === -1) {
            resetTransaction();
        } else {
            setTransaction(transactions[index]);
            setIsEveryone(false);
        }
    }, [open,index,transactions]);

    const [error, setError] = useState<ErrorMsg>({
        status: false,
        type: "",
        msg: "",
    })

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const toggleEveryone = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsEveryone(event.target.checked)
        transaction.For = [{IDPerson: -1,Amount: 0, Rest: true}]; // Restore default value
        setTransaction({...transaction});
    }

    const handleReason = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        transaction.Reason = event.target.value;
        setTransaction({...transaction});
    }

    function verifyInput(): (Transaction | undefined) {
        // Duplicate object
        const transactionVerify = {...transaction};

        // First line cannot be empty
        if(transactionVerify.Buyers[0].IDPerson === -1) {
            setError({status: true, type: "Buyers", msg: "You need at least one buyer"});
            return;
        }

        // First for cannot be empty if everyone is unchecked
        if(!isEveryone && transactionVerify.For[0].IDPerson === -1) {
            setError({status: true, type: "For", msg: "You need at least one payee"});
            return;
        }

        // Remove last entry if empty
        if(transactionVerify.Buyers[transactionVerify.Buyers.length-1].IDPerson === -1) {
            transactionVerify.Buyers.pop();
        }
        if(transactionVerify.For[transactionVerify.For.length-1].IDPerson === -1) {
            transactionVerify.For.pop();
        }

        // Calculate totals, usefull to make verifications
        const totalAmountBuyers = transactionVerify.Buyers.reduce((prevValue, buyer) => 
                prevValue + buyer.Amount, 0);
        const totalAmountFor = transactionVerify.For.reduce((prevValue, forWho) =>
                prevValue + forWho.Amount, 0);

        // Add equal parts for everyone if everyone is checked
        if(isEveryone) {
            participants.forEach(participant =>
                transactionVerify.For.push({
                    IDPerson: participant.IDPerson as number, 
                    Amount: 0, 
                    Rest: true})
            );
        } else if(!transactionVerify.For.find(purchase => purchase.Rest === true)) {
            // If every amount for are specify, the total must equal the total amount brought
            if(totalAmountBuyers !== totalAmountFor) {
                setError({status: true, type: "For", msg: "Sums aren't equals"});
                return;
            }
        } else {
            // Make sure for amount doesn't exceed buyers amount           
            if(totalAmountFor > totalAmountBuyers) {
                setError({status: true, type: "For", msg: "Received amount cannot exceed paid amount"});
                return;
            }
        }

        return transactionVerify;
    }

    // finishTransaction close dialog, reset values to default and
    // update state
    function finishTransaction(res: AxiosResponse<Transaction>) {
        setTransaction(resetTransaction());
        handleCloseDialog();
        setTransactions([res.data,...transactions]);
        const newDebts = calcDebt(participants,[res.data,...transactions]);
        setParticipants(newDebts);
        setError({status: false, type: "", msg: ""});
    }

    const handleAdd = async () => {
        const transactionVerify = verifyInput();
        if (!transactionVerify) {
            return;
        }

        // Send POST request to backend
        try {
            const res = await postTransaction(pognonHash, transactionVerify);
            finishTransaction(res);
        } catch (err) {
            if (err.response) {
                setError({status: true, type: "", msg: `${err.response.data}`});
            } else {
                setError({status: true, type: "", msg: `Backend error ${err}`});
            }
        }
    };

    const handleEdit = async () => {
        const transactionVerify = verifyInput();
        if (!transactionVerify) {
            return;
        }

        // Send PUT request to backend
        try {
            const res = await putTransaction(pognonHash, transactionVerify);
            finishTransaction(res);
        } catch (err) {
            if (err.response) {
                setError({status: true, type: "", msg: `${err.response.data}`});
            } else {
                setError({status: true, type: "", msg: `Backend error ${err}`});
            }
        }
    };

    return(
        <div>
        <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add a transaction</DialogTitle>
            <DialogContent>
                <Box mb={2}>
                <DialogContentText variant="h6">Who payed?</DialogContentText>
                <SelectPersons 
                    type="Buyers" 
                    participants={participants} 
                    transaction={transaction} 
                    setTransaction={setTransaction} 
                    error={error} 
                    setError={setError}
                />
                </Box>
                <DialogContentText variant="h6">Who benefits from the payment?</DialogContentText>
                <FormControlLabel
                    control={<Switch checked={isEveryone} onChange={toggleEveryone} name="everyone" />}
                    label="Everyone"
                />
                {!isEveryone &&
                <SelectPersons 
                    type="For" 
                    participants={participants} 
                    transaction={transaction} 
                    setTransaction={setTransaction} 
                    error={error} 
                    setError={setError}
                />
                }
                <TextField
                    margin="dense"
                    id="reason"
                    label="Reason (optional)"
                    type="text"
                    fullWidth
                    value={transaction.Reason}
                    onChange={handleReason}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    Cancel
                </Button>
                {(index === undefined || index === -1) ?
                <Button onClick={handleAdd} color="primary">
                    Add
                </Button>
                :
                <Button onClick={handleEdit} color="primary">
                    Edit
                </Button>
                }
            </DialogActions>
        </Dialog>
        <ErrorMessage errorMsg={error} />
        </div>
    )
}

export default AddTransaction