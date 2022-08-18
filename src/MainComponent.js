import React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from "@mui/x-date-pickers";
import DatePickerComponent from "./DatePickerComponent";
import {TextField} from "@mui/material";

class MainComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePickerComponent/>
                </LocalizationProvider>
            </div>
        )
    }

}

export default MainComponent;