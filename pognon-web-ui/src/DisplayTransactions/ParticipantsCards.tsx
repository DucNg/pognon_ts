import { Avatar, Box, Card, CardContent, CardHeader, Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons"
import React from "react";
import { Person } from "../utils/data";

interface Props {
    participants: Person[];
}

function ParticipantsCards({participants}: Props) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    return(
        <Box mb={2}>
        <Grid container spacing={3}>
        {participants[0] && participants.map((person: Person) => (
            <Grid key={person.IDPerson} item xs={3}>
                <Card key={person.Name}>
                <CardHeader key={person.Name}
                avatar={<Avatar aria-label="person">{person.Name[0]}</Avatar>}
                title={<Typography variant="h5">{person.Name}</Typography>}
                action={
                    <React.Fragment>
                    <IconButton
                        aria-label="settings"
                        aria-controls="settings-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                        >
                        <MoreVert/>
                    </IconButton>
                    <Menu
                        id="settings-menu"
                        keepMounted
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Edit</MenuItem>
                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                    </Menu>
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
        </Box>
    )
}

export default ParticipantsCards;