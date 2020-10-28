import React, { useState } from 'react';
import { TextField, MenuItem, InputLabel, Grid, Select, IconButton } 
    from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { Person } from '../utils/data';

interface Props {
    type: keyof item,
    participants: Person[],
}

interface item {
    buyer: string[],
    for: string[],
}

function SelectPersons({type,participants}: Props) {
    const [selectedItem, setSelectedItem] = useState<item>({
        buyer: [""],
        for: [""],
    });

    const handleChangeItems = (index: number, event: React.ChangeEvent<{name?: string; value: unknown;}>) => {
        const newSelection = event.target.value as string;
        const name = event.target.name as keyof item;
        let newArray = [""];
        if(index === selectedItem[name].length-1) {
            newArray = [...selectedItem[name],""];
        } else {
            newArray = selectedItem[name].slice();
        }
        newArray[index] = newSelection;
        setSelectedItem({...selectedItem, [name]: newArray});
    }
    
    const removeItem = (index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { name } = event.currentTarget;
        console.log(name);
        selectedItem[name as keyof item].splice(index,1);
        const newObject= {...selectedItem};
        setSelectedItem(newObject);
    }

    return(
        <div>
        {selectedItem[type].map((_,index) => (
            <Grid container key={"grid-container-"+type+index} alignItems="center" wrap="nowrap" spacing={3}>
                <Grid item key={"grid-item-select-"+type+"-"+index} className="grid-item" xs={3}>
                    <InputLabel key={"label-"+type+"-"+index} id={"select-"+type+"-"+index}>{type} {index}</InputLabel>
                    <Select
                        labelId={"select-"+type+index}
                        id={"select-"+type+"-"+index}
                        name={type}
                        key={"select-"+type+"-"+index}
                        value={selectedItem[type][index]}
                        onChange={(event) => handleChangeItems(index,event)}
                        >
                        {participants[0] && participants.map(participant =>
                        <MenuItem key={"menu-"+index+"-"+participant.IDPerson} 
                            value={participant.Name}>{participant.Name}</MenuItem>
                        )}
                    </Select>
                </Grid>
                <Grid key={"grid-item-text-"+index} item xs={7}>
                    <TextField
                        margin="dense"
                        id="amount"
                        label="Amount"
                        type="number"
                        key={"textField"+index}
                        fullWidth
                    />
                </Grid>
                <Grid key={"grid-item-button-"+index} item xs={2}>
                    {index > 0 &&
                    <IconButton name={type} onClick={(event) => removeItem(index,event)} aria-label="delete">
                        <Delete/>
                    </IconButton>
                    }
                </Grid>
            </Grid>
        ))}
        </div>
    )
}

export default SelectPersons;