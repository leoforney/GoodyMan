import React from 'react';
import {DatePicker} from "@mui/x-date-pickers";
import {Button, Grid, TextField, Typography} from "@mui/material";

class DatePickerComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fromDate: new Date('2018-08-18'),
            toDate: new Date('2018-08-18'),
            loaded: false,
            count: 0
        }
    }

    componentDidMount() {
        this.fetchDateRange()
    }

    render() {

        var countElement = <div></div>;

        console.log(this.state.count)
        if (this.state.count > 0) {
            countElement = <Typography variant={"body1"}>{this.state.count} Entries loaded</Typography>
        }

        return (
            <Grid container spacing={2}>
                <Grid item xs={2}></Grid>
                <Grid item xs={3}>
                    <DatePicker
                        label="From date"
                        inputFormat="MM/DD/YYYY"
                        value={this.state.fromDate}
                        onChange={(newVal) => {
                            this.setState({"loaded": false})
                            console.log(newVal)
                            this.setState({fromDate: newVal})
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid item xs={3}>
                    <DatePicker
                        label="To date"
                        inputFormat="MM/DD/YYYY"
                        value={this.state.toDate}
                        onChange={(newVal) => {
                            this.setState({"loaded": false})
                            console.log(newVal)
                            this.setState({toDate: newVal})
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained" onClick={() => {
                        this.fetchDateRange()
                    }}>Fetch date range</Button>
                    <div style={{height: 10}} />
                    <Button variant="contained" onClick={() => {
                        this.loadData()
                    }} disabled={this.state.loaded}>Load data</Button>
                    <div style={{height: 10}} />
                    {countElement}
                </Grid>
                <Grid item xs={2}></Grid>
            </Grid>
        );
    }

    fetchDateRange() {
        fetch('http://localhost:5000/scanRange')
            .then((response) => response.json())
            .then((data) => {
                var dFrom = new Date(0);
                var dTo = new Date(0);
                dFrom.setUTCSeconds(data.from)
                dTo.setUTCSeconds(data.to)
                console.log(dFrom);
                console.log(dTo);
                this.setState({"fromDate": dFrom, "toDate": dTo})
            })
    }

    loadData() {
        var data = {"from": this.state.fromDate.valueOf(), "to": this.state.toDate.valueOf()}
        fetch('http://localhost:5000/loadData',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((response) => response.json())
            .then((response) => {
                if (response.status === "Loaded") {
                    console.log(response)
                    this.setState({"loaded": true, "count": response.size})
                }

        })
    }
}

export default DatePickerComponent;