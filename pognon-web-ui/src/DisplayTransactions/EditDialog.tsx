import React, { ChangeEvent, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@material-ui/core";
import { Person } from '../utils/data';

interface Props {
    openEdit: boolean,
    setOpenEdit: React.Dispatch<React.SetStateAction<boolean>>,
    handleEdit: () => Promise<void>
    personToEdit: PersonToEdit
    setPersonToEdit: React.Dispatch<React.SetStateAction<PersonToEdit>>
}

interface PersonToEdit {
    person?: Person,
    index: number
}

function EditDialog({openEdit, setOpenEdit, handleEdit, personToEdit, setPersonToEdit}: Props) {
    const [name, setName] = React.useState<string>(personToEdit.person?.Name as string)

    useEffect(() => {
        setName(personToEdit.person?.Name as string);
    }, [personToEdit]);

    const handleClose = () => {
        setOpenEdit(false);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
       setName(event.target.value);
    }

    const handleSend = () => {
        if (!personToEdit.person) return
        personToEdit.person.Name = name
        setPersonToEdit({...personToEdit});
        handleEdit();
    }

    return(
        <Dialog
            open={openEdit}
            onClose={handleClose}
        >
            <DialogTitle>{"Edit person"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    type="text"
                    label="Name"
                    //value={personToEdit.person?.Name}
                    value={name}
                    defaultValue={personToEdit.person?.Name}
                    onChange={handleChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSend} color="primary">
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditDialog;