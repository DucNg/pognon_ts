import { Snackbar } from "@material-ui/core";
import React from "react";
import { ErrorMsg } from "./utils/data";

interface Props {
    errorMsg: ErrorMsg
}

function ErrorMessage({errorMsg}: Props) {
    return (
        <Snackbar open={errorMsg.status} message={`Error: ${errorMsg.msg}`} color="secondary"/>
    )
}

export default ErrorMessage;