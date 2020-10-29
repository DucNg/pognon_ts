import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField, Fab, 
    DialogActions, DialogContentText, Box, FormControlLabel, Switch } 
    from '@material-ui/core'
import { Add } from '@material-ui/icons'

import './AddTransaction.css'

import { Person,Transaction } from '../utils/data';
import SelectPersons from './SelectPersons'

interface Props {
    participants: Person[]
}

interface item {
    buyer: string[],
    for: string[],
}

function AddTransaction({participants}: Props) {
    const [open, setOpen] = useState(false);
    const [isEveryone, setIsEveryone] = useState(true)
    const [transaction, setTransaction] = useState<Transaction>({
        Buyers: [{IDPerson: -1,Amount: 0}],
        For: [{IDPerson: -1,Amount: 0}],
        Reason: "",
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
                <SelectPersons type="Buyers" participants={participants} transaction={transaction} setTransaction={setTransaction}/>
                </Box>
                <DialogContentText variant="h6">Who benefits from the payment?</DialogContentText>
                <FormControlLabel
                    control={<Switch checked={isEveryone} onChange={toggleEveryone} name="everyone" />}
                    label="Everyone"
                />
                {!isEveryone &&
                <SelectPersons type="For" participants={participants} transaction={transaction} setTransaction={setTransaction}/>
                }
                <TextField
                    margin="dense"
                    id="reason"
                    label="Reason (optional)"
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleCloseDialog} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}

export default AddTransaction