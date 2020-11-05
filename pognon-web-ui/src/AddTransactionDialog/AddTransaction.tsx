import React, { ChangeEvent, useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField, Fab, 
    DialogActions, DialogContentText, Box, FormControlLabel, Switch, Snackbar } 
    from '@material-ui/core';
import { Add } from '@material-ui/icons';

import './AddTransaction.css';

import { Person,Transaction } from '../utils/data';
import SelectPersons from './SelectPersons';
import { postTransaction } from '../utils/api';

interface Props {
    pognonHash: string,
    participants: Person[],
}

interface item {
    buyer: string[],
    for: string[],
}

function AddTransaction({pognonHash, participants}: Props) {
    const [open, setOpen] = useState(false);
    const [isEveryone, setIsEveryone] = useState(true)
    const [transaction, setTransaction] = useState<Transaction>({
        Buyers: [{IDPerson: -1,Amount: 0}],
        For: [{IDPerson: -1,Amount: 0}],
        Reason: "",
    })
    const [error, setError] = useState({
        status: false,
        type: "",
        msg: "",
    })

    const add = () => {
        setOpen(true)
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const toggleEveryone = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsEveryone(event.target.checked)
    }

    const handleReason = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        transaction.Reason = event.target.value;
        setTransaction({...transaction});
    }

    const handleAdd = async () => {
        // Duplicate object
        const transactionVerify = {...transaction};

        // First line cannot be empty
        if(transactionVerify.Buyers[0].IDPerson === -1) {
            setError({status: true, type: "Buyers", msg: "You need at least one buyer"});
            return
        }

        // TODO: first for cannot be empty if everyone is unchecked

        // Remove last entry if empty
        if(transactionVerify.Buyers[transactionVerify.Buyers.length-1].IDPerson === -1) {
            transactionVerify.Buyers.pop();
        }
        if(transactionVerify.For[transactionVerify.For.length-1].IDPerson === -1) {
            transactionVerify.For.pop();
        }

        // Add equal parts for everyone if everyone is checked
        const totalAmount = transactionVerify.Buyers.reduce((prevValue, buyer) => 
                prevValue = buyer.Amount, 0);
        if(isEveryone) {
            const equalPart = totalAmount / participants.length;
            participants.forEach(participant =>
                transactionVerify.For.push({IDPerson: participant.IDPerson, Amount: equalPart})
            );
        } else {
            // Make sure buyers amount equals for amount
            const totalAmountFor = transactionVerify.For.reduce((prevValue, forWho) =>
                prevValue = forWho.Amount, 0);
            if(totalAmount !== totalAmountFor) {
                setError({status: true, type: "For", msg: "Sums aren't equals"});
                return
            }
        }

        // Send POST request to backend
        if (!error.status) {
            try {
                const res = await postTransaction(pognonHash, transactionVerify);
                setTransaction({
                    Buyers: [{IDPerson: -1,Amount: 0}],
                    For: [{IDPerson: -1,Amount: 0}],
                    Reason: "",
                });
                handleCloseDialog();
                console.log(res);
            } catch (err) {
                setError({status: true, type: "", msg: `Backend error ${err}`})
            }
        }
    };

    return(
        <div>
        <Fab className="fab" color="secondary" aria-label="add" onClick={add}>
            <Add />
        </Fab>
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
                <Button onClick={handleAdd} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={error.status} message={`Error: ${error.msg}`} color="secondary"/>
        </div>
    )
}

export default AddTransaction