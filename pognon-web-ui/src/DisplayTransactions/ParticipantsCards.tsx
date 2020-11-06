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
            <Grid key={person.Name} item xs={3}>
                <Card key={person.Name}>
                <CardHeader key={person.Name}
                avatar={<Avatar aria-label="person">{person.Name[0]}</Avatar>}
                title={<Typography variant="h5">{person.Name}</Typography>}
                >
                </CardHeader>
                <CardContent>
                <Typography variant="body1">Debt: {person && person.Debt && person.Debt.toFixed(2)}€</Typography>
                <Typography variant="body2">Owe 25€ to Lorem</Typography>
                </CardContent>
                </Card>
            </Grid>))}
        </Grid>
        </Box>
    )
}

export default ParticipantsCards;