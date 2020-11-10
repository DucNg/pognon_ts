import { Box, Button, Chip, Container, Grid, Paper, Snackbar, TextField, Typography } from "@material-ui/core";
import React, { ChangeEvent, useState, KeyboardEvent } from "react";
import { errorTransaction, PognonJSON } from "./utils/data";
import "./HomePage.css";
import { postPognon } from "./utils/api";
import { encode } from "./utils/base64-url";
import { Redirect } from "react-router-dom";

function HomePage() {
    const [pognonJSON, setPognonJSON] = useState<PognonJSON>({
        Pognon: {PognonHash: ""},
        Participants: [],
    });
    const [participantName, setParticipantName] = useState("");
    const [error, setError] = useState<errorTransaction>({
        status: false,
        type: "",
        msg: ""
    })

    const handleChangePognon = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        pognonJSON.Pognon.PognonHash = event.target.value;
        setPognonJSON({...pognonJSON});
    }
    
    const handleChangeParticipantInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setParticipantName(event.target.value);
    }

    const handleAdd = () => {
        if (participantName !== "") {
            pognonJSON.Participants.push({Name: participantName});
            setPognonJSON({...pognonJSON})
            setParticipantName("");
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            handleAdd();
        }
    }

    const handleDelete = (index: number) => {
        pognonJSON.Participants.splice(index,1);
        setPognonJSON({...pognonJSON});
    };

    const handleCreate = async () => {
        if (pognonJSON.Participants.length === 0) {
            setError({status: true, type: "participant", msg: "You need at least one participant"})
            return
        }

        if (pognonJSON.Pognon.PognonHash === "") {
            var randomSeed = new Uint32Array(1);
            // Generate a random uint32
            window.crypto.getRandomValues(randomSeed);
            // Base64 encode this uint32 and remove unwanted char (/, =, ?)
            const hash = encode(randomSeed.toString());
            pognonJSON.Pognon.PognonHash = hash;
        }

        try {
            const response = await postPognon(pognonJSON);
            setPognonJSON(response.data);
            setError({status: false, type:"done", msg: ""});
        } catch(err) {
            if (err.response) {
                setError({status: true, type: "", msg: `${err.response.data}`});
            } else {
                setError({status: true, type: "", msg: `Backend error ${err}`});
            }
        }
    }

    return(
        <Container maxWidth="md">
            <Paper>
                <Typography variant="h1" align="center" paragraph>Welcome to pognon_ts!</Typography>
                <Typography variant="h3" align="center" paragraph>Manage your expenses with other persons.</Typography>
                <Typography variant="h3" align="center" paragraph>Everything is anonymous.</Typography>
                <Typography variant="h3" align="center" paragraph>Just create a <i>Pognon</i> and share the URL!</Typography>
                <Typography variant="h3" align="center" paragraph>Create a pognon now!</Typography>
                <Box p={10}><Grid container spacing={2} justify="center">
                    <Grid item xs={12}>
                        <TextField 
                            id="pognon-name" 
                            label="pognon name (leave empty for random *more secure*)"
                            autoFocus
                            fullWidth
                            variant="outlined"
                            value={pognonJSON.Pognon.PognonHash}
                            onChange={handleChangePognon}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            id="participant-name"
                            label="Participant name"
                            variant="outlined"
                            value={participantName}
                            onChange={handleChangeParticipantInput}
                            onKeyDown={(event) => handleKeyDown(event)}
                            error={error.type === "participant" && error.status}
                            helperText={error.type === "participant" && error.msg}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button variant="contained" onClick={handleAdd}>Add</Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Paper elevation={3}><Box p={1}>
                            {pognonJSON.Participants.length === 0 && <Typography 
                                variant="subtitle1"
                                color="textSecondary"
                                >
                                    List of participants goes here</Typography>}
                            {pognonJSON.Participants.map((participant, index) =>
                                <Chip
                                    className="chip"
                                    key={`chip-${index}`}
                                    label={participant.Name}
                                    onDelete={() => handleDelete(index)}
                                />    
                            )}
                        </Box></Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Button variant="contained" color="primary" onClick={handleCreate}>
                            Create
                        </Button>
                    </Grid>
                </Grid></Box>
            </Paper>
            {!error.status && error.type === "done" &&
                <Redirect to={{pathname: `/${pognonJSON.Pognon.PognonHash}`}}/>
            }
            <Snackbar open={error.status} message={`Error: ${error.msg}`} color="secondary"/>
        </Container>
    )
}

export default HomePage;