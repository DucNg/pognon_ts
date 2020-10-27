import React, { useState } from 'react';
import { Button, Dialog, DialogContent, DialogTitle, TextField, Fab, DialogActions, MenuItem, InputLabel } from '@material-ui/core'
import { Add } from '@material-ui/icons'

import { Person } from './data';
import Select from '@material-ui/core/Select/Select';

interface Props {
    participants: Person[]
}

function AddTransaction({participants}: Props) {
    const [open, setOpen] = useState(false);
    const [selectedBuyers, setSelectedBuyers] = useState([""])

    const add = () => {
        setOpen(true)
    }

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleChangeBuyers = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newSelection = event.target.value as string
        const newArray = [newSelection]
        setSelectedBuyers(newArray)
    }

    return(
        <div>
        <Fab className="fab" color="secondary" aria-label="add" onClick={add}>
            <Add />
        </Fab>
            <Dialog open={open} onClose={handleCloseDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add a transaction</DialogTitle>
                <DialogContent>
                    <InputLabel id="select-buyers">Buyer</InputLabel>
                    <Select
                        labelId="select-buyers"
                        id="select-buyers"
                        value={selectedBuyers}
                        onChange={handleChangeBuyers}
                    >
                        {participants[0] && participants.map(participant =>
                          <MenuItem value={participant.Name}>{participant.Name}</MenuItem>
                        )}
                    </Select>
                    <TextField
                        margin="dense"
                        id="amount"
                        label="Amount"
                        type="number"
                        // step="0.01"
                        fullWidth
                    />
                    <TextField
                        autoFocus
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