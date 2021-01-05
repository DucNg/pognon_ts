import { Avatar, Box, Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core";
import React from "react";
import { Person } from "../utils/data";

interface Props {
    participants: Person[];
}

function ParticipantsCards({participants}: Props) {
    return(
        <Box mb={2}>
        <Grid container spacing={3}>
        {participants[0] && participants.map((person: Person) => (
            <Grid key={person.IDPerson} item xs={3}>
                <Card key={person.Name}>
                <CardHeader key={person.Name}
                avatar={<Avatar aria-label="person">{person.Name[0]}</Avatar>}
                title={<Typography variant="h5">{person.Name}</Typography>}
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
                <Typography variant="body2">
                    Owe {owe.amount.toFixed(2)}€ to {owe.toWho}
                </Typography>
                ))}
                </CardContent>
                </Card>
            </Grid>))}
        </Grid>
        </Box>
    )
}

export default ParticipantsCards;