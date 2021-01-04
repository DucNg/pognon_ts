import { Avatar, Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons"
import React from "react";
import ErrorMessage from "../ErrorMessage";
import { deletePerson } from "../utils/api";
import { ErrorMsg, Person } from "../utils/data";

interface Props {
    participants: Person[];
    setParticipants: React.Dispatch<React.SetStateAction<Person[]>>;
    hash: string;
}

interface PersonToDelete {
    person?: Person,
    index: number
}

function ParticipantsCards({participants, setParticipants, hash}: Props) {
    const [openSure, setOpenSure] = React.useState<boolean>(false);
    const [personToDelete, setPersonToDelete] = React.useState<PersonToDelete>({
        person: undefined,
        index: 0
    });
    const [errorMsg, setErrorMsg] = React.useState<ErrorMsg>({
        status: false,
        msg: "",
    })

    const handleOpenSure = (person: Person, index: number) => {
        setPersonToDelete({person,index});
        setOpenSure(true);
    }

    const handleCloseSure = () => {
        setOpenSure(false);
    }

    const handleDelete = async () => {
        if (!personToDelete.person) { return }
        try {
            await deletePerson(hash, personToDelete.person);
            participants.splice(personToDelete.index, 1);
            setParticipants([...participants]);
        } catch(err) {
            console.log(err);
            setErrorMsg({status: true, msg: `${err.response.data}`})
        }
    }

    return(
        <Box mb={2}>
        <Dialog 
            open={openSure}
            onClose={handleCloseSure}
        >
            <DialogTitle>{"Are you sure?"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this person?
                    Make sure he is not involved in any transaction
                    before deleting.
                </DialogContentText>
                <DialogActions>
                    <Button onClick={handleCloseSure} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
        <Grid container spacing={3}>
        {participants[0] && participants.map((person: Person, index) => (
            <Grid key={person.IDPerson} item xs={3}>
                <Card key={person.Name}>
                <CardHeader key={person.Name}
                avatar={<Avatar aria-label="person">{person.Name[0]}</Avatar>}
                title={<Typography variant="h5">{person.Name}</Typography>}
                action={
                    <React.Fragment>
                    <IconButton
                        aria-label="delete"
                        onClick={_ => handleOpenSure(person, index)}
                        >
                        <Delete/>
                    </IconButton>
                    </React.Fragment>
                }
                >
                </CardHeader>
                <CardContent>
                <Typography variant="body1">Debt: {person && person.Debt && person.Debt.toFixed(2)}€</Typography>
                {person.Owe && person.Owe.map((owe, index) => (
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