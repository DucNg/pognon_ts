import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import React from "react";

interface Props {
    openSure: boolean,
    setOpenSure: React.Dispatch<React.SetStateAction<boolean>>,
    handleDelete: () => Promise<void>
    message: string
}

function SureDialog({openSure, setOpenSure, handleDelete, message}: Props) {
    const handleCloseSure = () => {
        setOpenSure(false);
    }

    return (
        <Dialog 
            open={openSure}
            onClose={handleCloseSure}
        >
            <DialogTitle>{"Are you sure?"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
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
    )
}

export default SureDialog;