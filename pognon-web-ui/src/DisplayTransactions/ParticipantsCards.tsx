import { Box, Card, CardContent, CardHeader, Grid, IconButton, Typography } from "@material-ui/core";
import { Delete, Edit } from "@material-ui/icons"
import React from "react";
import ErrorMessage from "../ErrorMessage";
import { deletePerson, putPerson } from "../utils/api";
import { ErrorMsg, Person } from "../utils/data";
import EditDialog from "./EditDialog";
import SureDialog from "./SureDialog";

interface Props {
    participants: Person[];
    setParticipants: React.Dispatch<React.SetStateAction<Person[]>>;
    hash: string;
}

interface PersonToEdit {
    person?: Person,
    index: number
}

function ParticipantsCards({participants, setParticipants, hash}: Props) {
    const [openSure, setOpenSure] = React.useState<boolean>(false);
    const [personToEdit, setPersonToEdit] = React.useState<PersonToEdit>({
        person: undefined,
        index: 0
    });
    const [errorMsg, setErrorMsg] = React.useState<ErrorMsg>({
        status: false,
        msg: "",
    })
    const [openEdit, setOpenEdit] = React.useState<boolean>(false);

    const handleOpenSure = (personToDelete: PersonToEdit) => {
        setPersonToEdit(personToDelete);
        setOpenSure(true);
    }

    const handleDelete = async () => {
        if (!personToEdit.person) { return }
        try {
            await deletePerson(hash, personToEdit.person);
            participants.splice(personToEdit.index, 1);
            setParticipants([...participants]);
        } catch(err) {
            console.log(err);
            setErrorMsg({status: true, msg: `${err.response.data}`})
        }
    }

    const handleOpenEdit = (personToEdit: PersonToEdit) => {
        setPersonToEdit({...personToEdit});
        console.log(personToEdit.person?.Name as string);
        setOpenEdit(true);
    }

    const handleEdit = async () => {
        if (!personToEdit.person) { return }
        try {
            const editedPerson = await putPerson(hash, personToEdit.person);
            participants[personToEdit.index].Name = editedPerson.data.Name;
            setParticipants([...participants]);
        } catch(err) {
            console.log(err);
            setErrorMsg({status: true, msg: `${err.response.data}`})
        }
    }

    return(
        <Box mb={2}>
        <SureDialog 
            openSure={openSure}  
            setOpenSure={setOpenSure}    
            handleDelete={handleDelete}
            message={
                `Are you sure you want to delete this person?
                Make sure he is not involved in any transaction
                before deleting.`
            }
        />
        <EditDialog
            openEdit={openEdit}
            setOpenEdit={setOpenEdit}
            handleEdit={handleEdit}
            personToEdit={personToEdit}
            setPersonToEdit={setPersonToEdit}
        />
        <Grid container spacing={3}>
        {participants[0] && participants.map((person: Person, index) => (
            <Grid key={person.IDPerson} item xs={3}>
                <Card key={person.Name}>
                <CardHeader key={person.Name}
                title={<Typography variant="h5">{person.Name}</Typography>}
                action={
                    <React.Fragment>
                    <IconButton
                        aria-label="edit"
                        onClick={_ => handleOpenEdit({person, index})}
                        >
                        <Edit/>
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        onClick={_ => handleOpenSure({person, index})}
                        >
                        <Delete/>
                    </IconButton>
                    </React.Fragment>
                }
                >
                </CardHeader>
                <CardContent>
                <Typography variant="body1">
                    {(person && person.Debt) && (person.Debt > 0 
                    ? `Debt: ${person.Debt.toFixed(2)}`
                    : `Credit: ${-person.Debt.toFixed(2)}`)}
                    €
                </Typography>
                {person.Owe && person.Owe.map(owe => (
                <Typography key={`${person.IDPerson}-owe-${index}`} variant="body2">
                    Owe {owe.amount.toFixed(2)}€ to {owe.toWho}
                </Typography>
                ))}
                </CardContent>
                </Card>
            </Grid>))}
        </Grid>
        <ErrorMessage errorMsg={errorMsg} />
        </Box>
    )
}

export default ParticipantsCards;