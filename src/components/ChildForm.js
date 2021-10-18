import React from 'react'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { CONSTANTS } from './Constants'
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import CloseIcon from '@material-ui/icons/Close';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';


const ChildForm = (props) => {
    const [isError, setIsError] = React.useState(props.isError)

    React.useEffect(() => {
        setIsError(props.isError)
    }, [props.isError])

    const i = props.i
    const [optionValues, setOptionValues] = React.useState(props.childInfo[i] ? props.childInfo[i] : { relationship: "", gender: "", firstName: "", maidenName: "", lastName: "", motherName: "", fatherName: "", dob: "", alive: "", dod: "", cancerPlace: "", cancerAge: "", cancerTreated: "" })

    const handleChange = (value, i, selector) => {
        setOptionValues({ ...optionValues, [selector]: value })
        // parent state update - ChildrenInfo
        const _obj = { ...optionValues, [selector]: value }
        _obj[selector] = value
        const _childinfo = [...props.childInfo]
        _childinfo[i] = _obj
        props.setChildInfo(_childinfo)
    }

    const handleDobChange = (date) => {
        let date_utc = date.toISOString();
        setOptionValues({ ...optionValues, dob: date_utc })
        // parent state update - ChildrenInfo
        const _obj = { ...optionValues, dob: date_utc }
        _obj['dob'] = date_utc
        const _childinfo = [...props.childInfo]
        _childinfo[i] = _obj
        props.setChildInfo(_childinfo)
    }

    const handleDodChange = (date) => {
        let date_utc = date.toISOString();
        setOptionValues({ ...optionValues, dod: date_utc })
        // parent state update - ChildrenInfo
        const _obj = { ...optionValues, dod: date_utc }
        _obj['dod'] = date_utc
        const _childinfo = [...props.childInfo]
        _childinfo[i] = _obj
        props.setChildInfo(_childinfo)
    }

    return (
        <div key={i} className='user-card'>
            <Grid container spacing={3}>
                <Grid item xs={10} md={11}>
                    <Typography variant="h5" gutterBottom>
                        {CONSTANTS.relations[optionValues.relationship]}
                    </Typography>
                </Grid>

                <Grid item xs={2} md={1}>
                    <CloseIcon
                        style={{ color: 'red', cursor: 'pointer' }}
                        variant='outlined'
                        // className = "btn"
                        onClick={() => props.removeChild(i)}
                    // disabled = {isDisable}
                    />
                </Grid>

                <Grid item xs={4}>
                    <TextField
                        error={isError === true && optionValues.firstName === ""}
                        label="First Name"
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name="firstName"
                        value={optionValues.firstName}
                        onChange={(e) => handleChange(e.target.value, i, e.target.name)}
                        className='form-input'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        label="Maiden Name"
                        variant="outlined"
                        fullWidth
                        name="maidenName"
                        value={optionValues.maidenName}
                        onChange={(e) => handleChange(e.target.value, i, e.target.name)}
                        className='form-input'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error={isError === true && optionValues.lastName === ""}
                        label="Last Name"
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        name="lastName"
                        value={optionValues.lastName}
                        onChange={(e) => handleChange(e.target.value, i, e.target.name)}
                        className='form-input'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error={isError === true && optionValues.motherName === "" && (optionValues.relationship === "halfSister" || "halfBrother")}
                        helperText="Important in case of half brother/sister"
                        label="Mother's Name"
                        variant="outlined"
                        fullWidth
                        name="motherName"
                        value={optionValues.motherName}
                        onChange={(e) => handleChange(e.target.value, i, e.target.name)}
                        className='form-input'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        error={isError === true && optionValues.fatherName === "" && (optionValues.relationship === "halfSister" || "halfBrother")}
                        helperText="Important in case of half brother/sister"
                        label="Father's Name"
                        variant="outlined"
                        fullWidth
                        name="fatherName"
                        value={optionValues.fatherName}
                        onChange={(e) => handleChange(e.target.value, i, e.target.name)}
                        className='form-input'
                    />
                </Grid>
                {/* <Grid item xs={4}>
                    <TextField
                        error = {isError === true && optionValues.dob === ""}
                        helperText="Date of Birth" 
                        variant="outlined"
                        required id="standard-required"
                        fullWidth
                        type="date"
                        name = "dob"
                        value = {optionValues.dob.split('T')[0]}
                        onChange = {(e) => handleChange(e.target.value, i, e.target.name)}
                        className = 'form-input'
                    />
                </Grid> */}
                <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            error={isError === true && optionValues.dob === ""}
                            helperText="Date of Birth"
                            inputVariant="outlined"
                            // margin="normal"
                            id="date-picker-dob"
                            label="Date of Birth"
                            format="dd/MM/yyyy"
                            value={optionValues.dob ? optionValues.dob : null}
                            name='dob'
                            onChange={handleDobChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                    <div className="form-margin">
                        <Typography variant="h6" gutterBottom>
                            Is this family member alive? If they are deceased, please provide a date of death below if known.?
                        </Typography>
                        <FormControl component="fieldset" error={isError === true && optionValues.alive === ""}>
                            <RadioGroup aria-label="alive" name="alive" value={optionValues.alive} onChange={(e) => handleChange(e.target.value, i, e.target.name)}>
                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                <FormControlLabel value="false" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Grid>
                {/* <Grid item xs={4}>
                    <TextField
                        helperText="Date of Death" 
                        variant="outlined"
                        fullWidth
                        name = "dod"
                        type="date"
                        value = {optionValues.dod}
                        onChange = {(e) => handleChange(e.target.value, i, e.target.name)}
                        className = 'form-input'
                        disabled = {optionValues.alive === 'true'}
                    />
                </Grid> */}
                <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            helperText="Date of Death"
                            inputVariant="outlined"
                            // margin="normal"
                            id="date-picker-dod"
                            label="Date of Death"
                            format="dd/MM/yyyy"
                            value={optionValues.dod ? optionValues.dod : null}
                            name='dod'
                            onChange={handleDodChange}
                            disabled={optionValues.alive === 'true'}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                {/* changes in regards to the new form format on teams */}
                {/* <Grid item xs={4}>
                    <TextField
                        helperText="If suffered/suffering from cancer"
                        label="Place where cancer occured"
                        variant="outlined"
                        fullWidth
                        name="cancerPlace"
                        value={optionValues.cancerPlace}
                        onChange={(e) => handleChange(e.target.value, i, e.target.name)}
                        className='form-input'
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        helperText="If suffered/suffering from cancer"
                        label="Age when cancer occured"
                        variant="outlined"
                        fullWidth
                        type="number"
                        name="cancerAge"
                        value={optionValues.cancerAge}
                        onChange={(e) => handleChange(e.target.value, i, e.target.name)}
                        className='form-input'
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        helperText="If suffered/suffering from cancer"
                        label="Hospital where treated and name of specialist"
                        variant="outlined"
                        fullWidth
                        multiline
                        name="cancerTreated"
                        value={optionValues.cancerTreated}
                        onChange={(e) => handleChange(e.target.value, i, e.target.name)}
                        className='form-input'
                    />
                </Grid> */}

            </Grid>
        </div>
    )
}
export default ChildForm;