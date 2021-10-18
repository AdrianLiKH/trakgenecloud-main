import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

//date
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';


const PersonalInfo = (props) => {
    //styling for appbar https://material-ui.com/components/app-bar/
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        formControl: {
            minWidth: 120,
            width: "100%"
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));
    const classes = useStyles();

    const [stateErr, setstateErr] = useState({ firstName: false, lastName: false, address_line1: false, address_line2: false, address_city: false, address_post: false, dob: false, gpName: false, gpAddress_line1: false, gpAddress_line2: false, gpAddress_city: false, gpAddress_post: false, mobile: false, discloseIdentity: false, receiveLetter: false, gender: false })

    const [isError, setIsError] = useState(true)
    let errWarning = []


    //function to check if values are saved properly
    const valueValidation = () => {
        const currentObj = { ...props.personalDetails }
        const valuesToCheck = ["firstName", "lastName", "address_line1", "address_city", "address_post", "dob", "gpName", "gpAddress_line1", "gpAddress_city", "gpAddress_post", "mobile", "discloseIdentity", "receiveLetter", "gender"]
        if (props.checkEmptyVals(valuesToCheck, currentObj)) {
            props.updateError(valuesToCheck, currentObj, stateErr, setstateErr, setIsError)
            return true;
        } else {
            return false
        }

    }

    //save data to database
    const sendData = () => {
        debugger
        if (valueValidation()) {
            debugger
            errWarning.push(
                <>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            This user already exists
                        </Typography>
                    </Grid>
                </>
            )
        } else {
            debugger
            props.saveData()
            props.setStep(6)
        }
    }

    //function to move to next step
    const moveNext = (e) => {
        e.preventDefault();
        if (valueValidation()) {
            errWarning.push(
                <>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            This user already exists
                        </Typography>
                    </Grid>
                </>
            )
            console.log(errWarning)

        } else {
            props.nextStep();
        }

    }

    //function to move to previous step
    const movePrev = (e) => {
        e.preventDefault();
        props.prevStep();
    }

    const values = { ...props.personalDetails };
    // console.log(values)
    let isDisable = false
    if (props.disableButton)
        isDisable = props.disableButton

    useEffect(() => {
        //assign probandId value
        let proBandId = props.generateId()
        props.personalDetails.proBandId = proBandId
    }, [])

    //date
    const handleDateChange = (date) => {
        let date_utc = date.toISOString();
        props.setPersonalDetails({ ...values, dob: date_utc })
    }


    return (
        <>
            {/* <div className={classes.root}> */}

            <div className="personal-form">
                <h1>Personal Details</h1>
                <form >
                    <Grid container spacing={3}>
                        {errWarning}
                        <Grid item xs={3}>
                            <TextField
                                error={stateErr.firstName}
                                label="First Name"
                                variant="outlined"
                                required id="standard-required"
                                fullWidth
                                name="firstName"
                                value={values.firstName}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                label="Maiden Name"
                                variant="outlined"
                                fullWidth
                                name="maidenName"
                                value={values.maidenName}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                error={stateErr.lastName}
                                label="Last Name"
                                variant="outlined"
                                required id="standard-required"
                                fullWidth
                                name="lastName"
                                value={values.lastName}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl variant="outlined" className={classes.formControl} error={stateErr.gender}>
                                <InputLabel id="gender-select-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-select-label"
                                    id="gender-select-label"
                                    value={values.gender}
                                    onChange={props.handleChange}
                                    name="gender"
                                    fullWidth
                                >
                                    <MenuItem value={"male"}>Male</MenuItem>
                                    <MenuItem value={"female"}>Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* <Grid item xs={12}>
                                <TextField
                                    error = {stateErr.address}
                                    label="Address" 
                                    variant="outlined"
                                    required id="standard-required"
                                    fullWidth
                                    name = "address"
                                    value = {values.address}
                                    onChange = {props.handleChange}
                                    className = 'form-input'
                                />
                            </Grid> */}
                        <Grid item xs={12}>
                            <TextField
                                error={stateErr.address_line1}
                                label="Address Line 1"
                                variant="outlined"
                                required id="standard-required"
                                fullWidth
                                name="address_line1"
                                value={values.address_line1}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address Line 2"
                                variant="outlined"
                                // required id="standard-required"
                                fullWidth
                                name="address_line2"
                                value={values.address_line2}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                error={stateErr.address_city}
                                label="City"
                                variant="outlined"
                                required id="standard-required"
                                fullWidth
                                name="address_city"
                                value={values.address_city}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                error={stateErr.address_post}
                                label="Post Code"
                                variant="outlined"
                                required id="standard-required"
                                type="number"
                                fullWidth
                                name="address_post"
                                value={values.address_post}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        {/* date */}
                        <Grid item xs={4}>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    error={stateErr.dob}
                                    helperText="Please enter your date of birth"
                                    inputVariant="outlined"
                                    // margin="normal"
                                    id="date-picker-dialog"
                                    label="Date of Birth"
                                    format="dd/MM/yyyy"
                                    value={values.dob ? values.dob : null}
                                    name='dob'
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>

                        {/* <Grid item xs={4}>
                               <TextField
                                    error = {stateErr.dob}
                                    helperText="Please enter your date of birth"
                                    variant="outlined"
                                    required id="standard-required"
                                    format="dd/MM/yyyy"
                                    fullWidth
                                    name = "dob"
                                    type = "date"
                                    value = {values.dob?values.dob.split("T")[0]:""}
                                    onChange = {props.handleChange}
                                    className = 'form-input'
                                />
                            </Grid> */}
                        <Grid item xs={4}>
                            <TextField
                                error={stateErr.gpName}
                                label="GP Name"
                                variant="outlined"
                                required id="standard-required"
                                fullWidth
                                name="gpName"
                                value={values.gpName}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                error={stateErr.mobile}
                                label="Mobile"
                                variant="outlined"
                                required id="standard-required"
                                fullWidth
                                type="number"
                                name="mobile"
                                value={values.mobile}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                                <TextField
                                    error = {stateErr.gpAddress}
                                    label="GP Address" 
                                    variant="outlined"
                                    required id="standard-required"
                                    fullWidth
                                    name = "gpAddress"
                                    value = {values.gpAddress}
                                    onChange = {props.handleChange}
                                    className = 'form-input'
                                />
                            </Grid> */}
                        <Grid item xs={12}>
                            <TextField
                                error={stateErr.gpAddress_line1}
                                label="GP Address Line 1"
                                variant="outlined"
                                required id="standard-required"
                                fullWidth
                                name="gpAddress_line1"
                                value={values.gpAddress_line1}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="GP Address Line 2"
                                variant="outlined"
                                // required id="standard-required"
                                fullWidth
                                name="gpAddress_line2"
                                value={values.gpAddress_line2}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                error={stateErr.gpAddress_city}
                                label="City"
                                variant="outlined"
                                required id="standard-required"
                                fullWidth
                                name="gpAddress_city"
                                value={values.gpAddress_city}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                error={stateErr.gpAddress_post}
                                label="Post Code"
                                variant="outlined"
                                required id="standard-required"
                                type="number"
                                fullWidth
                                name="gpAddress_post"
                                value={values.gpAddress_post}
                                onChange={props.handleChange}
                                className='form-input'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <h3>We may contact you if we need further details. We will not disclose where we are calling from to anyone apart from yourself, without your permission.</h3>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={stateErr.discloseIdentity}>
                                <FormLabel component="legend">I am happy for you to disclose where you are calling from should someone other than myself answer the phone.*  </FormLabel>
                                <RadioGroup aria-label="Disclosure" name="discloseIdentity" value={values.discloseIdentity} onChange={props.handleChange}>
                                    <FormControlLabel value={"true"} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={"false"} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={stateErr.receiveLetter}>
                                <FormLabel component="legend">I would prefer to receive a letter from you, asking me to call the department, should you need any further details.* </FormLabel>
                                <RadioGroup aria-label="Disclosure" name="receiveLetter" value={values.receiveLetter} onChange={props.handleChange}>
                                    <FormControlLabel value={"true"} control={<Radio />} label="Yes" />
                                    <FormControlLabel value={"false"} control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} alignItems='flex-end'>
                        <Grid item xs={4}>
                            <Button
                                label="Continue"
                                color='primary'
                                variant='outlined'
                                className="btn"
                                onClick={moveNext}
                                disabled={isDisable}
                                fullWidth

                            >Continue</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                label="Previous"
                                color='primary'
                                variant='outlined'
                                className="btn"
                                onClick={movePrev}
                                disabled={isDisable}
                                fullWidth

                            >Previous</Button>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                label="Save"
                                color='primary'
                                variant='outlined'
                                className="btn"
                                disabled={isDisable}
                                onClick={(e) => sendData()}
                                fullWidth

                            >Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
            {/* </div> */}
        </>
    )
}

export default PersonalInfo
