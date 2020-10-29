import React, { ChangeEvent } from 'react';
import { TextField, MenuItem, InputLabel, Grid, Select, IconButton } 
    from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { Person, Purchase, Transaction } from '../utils/data';

interface Props {
    type: keyof item,
    participants: Person[],
    transaction: Transaction,
    setTransaction: React.Dispatch<React.SetStateAction<Transaction>>,
}

interface item {
    Buyers: string[],
    For: string[],
}

function SelectPersons({type,participants,transaction, setTransaction}: Props) {

    const handleChangeItems = (index: number, event: React.ChangeEvent<{name?: string; value: unknown;}>) => {
        const newSelection = event.target.value as number;
        const name = event.target.name as keyof item;
        let newArray: Purchase[] = [];
        if(index === transaction[name].length-1) {
            newArray = [...transaction[name],{IDPerson: -1, Amount: 0} as Purchase];
        } else {
            newArray = transaction[name].slice();
        }
        newArray[index].IDPerson = newSelection;
        setTransaction({...transaction, [name]: newArray});
    }
    
    const removeItem = (index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { name } = event.currentTarget;
        transaction[name as keyof item].splice(index,1);
        const newObject = {...transaction};
        setTransaction(newObject);
    }

    const handleChangeAmount = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = event.currentTarget;
        transaction[name as keyof item][index].Amount = parseFloat(event.target.value);
        const newObject = {...transaction};
        setTransaction(newObject);
    }

    return(
        <div>
        {transaction[type].map((_,index) => (
            <Grid container key={"grid-container-"+type+index} alignItems="center" wrap="nowrap" spacing={3}>
                <Grid item key={"grid-item-select-"+type+"-"+index} className="grid-item" xs={3}>
                    <InputLabel key={"label-"+type+"-"+index} id={"select-"+type+"-"+index}>{type} {index}</InputLabel>
                    <Select
                        labelId={"select-"+type+index}
                        id={"select-"+type+"-"+index}
                        name={type}
                        key={"select-"+type+"-"+index}
                        value={transaction[type][index].IDPerson === -1 ? "" : 
                            transaction[type][index].IDPerson}
                        onChange={(event) => handleChangeItems(index,event)}
                        >
                        {participants[0] && participants.map(participant =>
                        <MenuItem key={"menu-"+index+"-"+participant.IDPerson} 
                            value={participant.IDPerson}>{participant.Name}</MenuItem>
                        )}
                    </Select>
                </Grid>
                <Grid key={"grid-item-text-"+index} item xs={7}>
                    <TextField
                        margin="dense"
                        id="amount"
                        name={type}
                        label="Amount"
                        type="number"
                        key={"textField"+index}
                        value={transaction[type][index].Amount === 0 ? "" :
                            transaction[type][index].Amount}
                        onChange={(event) => handleChangeAmount(index,event)}
                        fullWidth
                    />
                </Grid>
                <Grid key={"grid-item-button-"+index} item xs={2}>
                    {index > 0 &&
                    <IconButton name={type} onClick={(event) => removeItem(index,event)} 
                      aria-label="delete">
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