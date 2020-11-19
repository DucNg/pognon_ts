import React, { ChangeEvent, useState } from 'react';
import { TextField, MenuItem, Grid, Select, IconButton, FormControlLabel, Switch } 
    from '@material-ui/core'
import { Delete, ExpandMore } from '@material-ui/icons'
import { Person, Purchase, Transaction, errorTransaction } from '../utils/data';

interface Props {
    type: keyof item,
    participants: Person[],
    transaction: Transaction,
    setTransaction: React.Dispatch<React.SetStateAction<Transaction>>,
    error: errorTransaction,
    setError: React.Dispatch<React.SetStateAction<errorTransaction>>
}

interface item {
    Buyers: string[],
    For: string[],
}

function SelectPersons({type, participants, transaction, setTransaction, error, setError}: Props) {
    const [amounts, setAmounts] = useState({
        Buyers: [""],
        For: [""],
    })

    const handleChangeItems = (index: number, event: React.ChangeEvent<{name?: string; value: unknown;}>) => {
        const newSelection = event.target.value as number;
        const name = event.target.name as keyof item;
        let newArray: Purchase[] = [];
        if((type === "For" || transaction.Buyers.length > 1) &&
            index === transaction[name].length-1) {
                newArray = [...transaction[name],{IDPerson: -1, Amount: 0, Rest: (type === "For")}];
        } else {
            newArray = transaction[name].slice();
        }
        newArray[index].IDPerson = newSelection;
        setTransaction({...transaction, [name]: newArray});
    }
    
    const removeItem = (index: number, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const { name } = event.currentTarget;
        transaction[name as keyof item].splice(index,1);
        setTransaction({...transaction});
        amounts[name as keyof item].splice(index,1);
        setAmounts({...amounts})
    }

    const handleToggleRest = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        transaction.For[index].Rest = event.target.checked;
        setTransaction({...transaction})
    }

    const handleChangeAmount = (index: number, type: keyof item, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = event.currentTarget;
        const value = Number(event.target.value);
        if(!isNaN(value)) {
            transaction[name as keyof item][index].Amount = value;
            amounts[name as keyof item][index] = event.target.value;
            setTransaction({...transaction});
            setAmounts({...amounts})
            setError({status: false, type: "", index: undefined, msg: ""});
        } else {
            setError({status: true, type: type, index: index, msg: "Enter a numeric value"});
        }
    }

    const correspondingError = (error: errorTransaction, type: keyof item, index: number): boolean => {
        return ((type === error.type && error.index === undefined) ||
        (type === error.type && index === error.index))
    } 

    const morePersons = (event: React.MouseEvent<HTMLButtonElement>) => {
        const newArray = [...transaction.Buyers,{IDPerson: -1, Amount: 0} as Purchase];
        setTransaction({...transaction, Buyers: newArray});
    }

    return(
        <div>
        {transaction[type].map((_,index) => (
            <Grid container key={"grid-container-"+type+index} alignItems="center" wrap="nowrap" spacing={1}>
                <Grid item key={"grid-item-select-"+type+"-"+index} className="grid-item" xs={2}>
                    <Select
                        labelId={"select-"+type+index}
                        id={"select-"+type+"-"+index}
                        name={type}
                        key={"select-"+type+"-"+index}
                        value={transaction[type][index].IDPerson}
                        onChange={(event) => handleChangeItems(index,event)}
                        error={
                            correspondingError(error, type, index)
                            ? error.status : false
                        }
                    >
                        <MenuItem key={`menu-placeholder-${index}`} disabled={true} value={-1}><em>Nobody</em></MenuItem>
                        {participants[0] && participants.map(participant =>
                        <MenuItem key={"menu-"+index+"-"+participant.IDPerson} 
                            value={participant.IDPerson}>{participant.Name}</MenuItem>
                        )}
                    </Select>
                </Grid>
                <Grid key={"grid-item-text-"+index} item xs={5}>
                    <TextField
                        margin="dense"
                        id={`amount-${type}-${index}`}
                        name={type}
                        label="Amount"
                        type="text"
                        key={`textField-${type}-${index}`}
                        value={amounts[type][index] || ""}
                        onChange={(event) => handleChangeAmount(index, type, event)}
                        // fullWidth
                        disabled={(transaction[type][index].IDPerson === -1) ||
                            (type === "For" && transaction.For[index].Rest)}
                        error={
                            correspondingError(error, type, index)
                            ? error.status : false
                        }
                        helperText={
                            correspondingError(error, type, index)
                            ? error.msg : ""
                        }
                    />
                </Grid>
                {type === "For" &&
                <Grid key={`grid-item-switch-${index}`} item xs={3}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={transaction.For[index].Rest}
                                onChange={(event) => handleToggleRest(index, event)}
                                name={type}
                                disabled={transaction.For[index].IDPerson === -1}
                                color="primary"
                                size="small"
                            />
                        }
                        label="a share"
                    />
                </Grid>
                }
                <Grid key={"grid-item-button-"+index} item xs={2}>
                    {index === 0 && type === "Buyers" &&
                    <IconButton onClick={morePersons} aria-label="more"
                        disabled={transaction.Buyers.length > 1}>
                        <ExpandMore/>
                    </IconButton>
                    }
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