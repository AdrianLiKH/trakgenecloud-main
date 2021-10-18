import React, { useState, useEffect } from 'react'
import axios from '../axios'

//material
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import CallMadeIcon from '@material-ui/icons/CallMade';

//import qs to read url
const qs = require('qs');



const UserInfo = (props) => {
    //variables
    // const userEmail = qs.parse(window.location.search, { ignoreQueryPrefix: true }).email
    // const [userType, setUserType] = useState()
    const id = qs.parse(window.location.search, { ignoreQueryPrefix: true }).id
    const familyId = qs.parse(window.location.search, { ignoreQueryPrefix: true }).familyId
    const [userData, setUserData] = useState({ address_line1: "", address_line2: "", address_city: "", address_post: "", gpAddress_line1: "", gpAddress_line2: "", gpAddress_city: "", gpAddress_post: "", disableForm: "", discloseIdentity: "", dob: "", firstName: "", email: "", gender: "", gpName: "", lastName: "", mobile: "", receiveLetter: "", maidenName: "", dod: "", proBandId: "" })
    const [changedUserData, setChangedUserData] = useState({})
    const [userViewData, setUserViewData] = useState({ address_line1: "", address_line2: "", address_city: "", address_post: "", gpAddress_line1: "", gpAddress_line2: "", gpAddress_city: "", gpAddress_post: "", disableForm: "", discloseIdentity: "", dob: "", firstName: "", email: "", gender: "", gpName: "", lastName: "", mobile: "", receiveLetter: "", maidenName: "", dod: "", isUserDateConfirmed: "" })

    const [isFamilyError, setIsFamilyError] = useState(false)
    const [isUserError, setIsUserError] = useState(false)

    const [serverReturn, setServerReturn] = useState()
    const [alertInfo, setAlertInfo] = useState({ severity: '', message: '' })

    const [familyData, setFamilyData] = useState({})
    const [changedFamilyData, setChangedFamilyData] = useState({})
    const [familyViewData, setFamilyViewData] = useState({ relationship: "", gender: "", firstName: "", maidenName: "", lastName: "", motherName: "", fatherName: "", dob: "", alive: "", dod: "", cancerPlace: "", cancerAge: "", cancerTreated: "", isfamilyMemberDateConfirmed: "" })


    const [editColor, setEditColor] = useState("primary")
    const [isEdit, setIsEdit] = useState(false)

    //client details
    let clientEmail = props.userEmail;
    let clientType = props.userType;

    //functions
    useEffect(() => {

        let path = '/admin/userData/getPersonalDetails'
        let userType
        let memberId
        //Getting user values from email
        if (familyId === "undefined") {
            userType = 0
            memberId = id
        } else {
            userType = 1
            memberId = familyId
        }


        axios.post(path, { userType, id: memberId, clientType: props.userType, clientEmail: props.userEmail })
            .then(res => {
                // console.log("in success")
                debugger
                console.log(res.data.userData);
                if (familyId === "undefined") {
                    setUserData(res.data.userData)
                    setChangedUserData(res.data.changedUserData)
                    setUserViewData({ ...res.data.userData, ...res.data.changedUserData })
                } else {
                    setFamilyData(res.data.familyData)
                    setChangedFamilyData(res.data.changedFamilyData)
                    setFamilyViewData({ ...res.data.familyData, ...res.data.changedFamilyData })
                }




            }).catch(err => {
                // alert('An error has occured')
                console.log(err)
            })

    }, [])
    //edit Icon
    let handleLabelColor = (e) => {
        editColor === "primary" ? setEditColor("secondary") : setEditColor("primary")

        if (editColor === "primary") {
            setEditColor("secondary")
            setIsEdit(true)
        } else {
            setEditColor("primary")
            setIsEdit(false)
        }
    }

    //handle user information change
    const handleUserChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setChangedUserData({ ...changedUserData, [name]: value })
        setUserViewData({ ...userViewData, [name]: value })
    }

    //handle family information change
    const handleFamilyChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setChangedFamilyData({ ...changedFamilyData, [name]: value })
        setFamilyViewData({ ...familyViewData, [name]: value })
    }

    //submit the changes to database
    //submit changed data into database
    const submitChanged = (props) => {
        // addRequiredData()
        let path = '/admin/usersChanged/addChangedIndividual'
        let typeUser = (familyId === "undefined") ? 0 : 1

        if (typeUser === 0) {
            let isEmpty = userViewData.firstName === "" || userViewData.lastName === "" || userViewData.dob === "" || !changedUserData.isUserDateConfirmed === true || userViewData.address === "" || userViewData.mobile === ""
            if (!isEmpty === true) {
                axios.post(path, { typeUser, changedUserData: { ...changedUserData, proBandId: userData.proBandId, email: userData.email, familyId: userData.familyId, oldUser_id: userData._id }, changedFamilyData: { ...changedFamilyData, familyId: familyData.familyId, familyMemberId: familyData.familyMemberId, user_id: familyData.user_id, }, userType: clientType, userEmail: clientEmail })
                    .then(res => {
                        console.log("in success")
                        setServerReturn(true)
                        setAlertInfo({ severity: "success", message: "The details were saved!" })
                    }).catch(err => {
                        console.log(err)
                        setServerReturn(true)
                        setAlertInfo({ severity: "error", message: "Error while saving values, please check the entered values" })
                    })
            } else
                setIsUserError(true)
        } else {
            let isEmpty = familyViewData.firstName === "" || familyViewData.lastName === "" || familyViewData.dob === "" || !changedFamilyData.isfamilyMemberDateConfirmed === true
            if (!isEmpty === true) {
                axios.post(path, { typeUser, changedUserData: { ...changedUserData, proBandId: userData.proBandId, email: userData.email, familyId: userData.familyId, oldUser_id: userData._id }, changedFamilyData: { ...changedFamilyData, familyId: familyData.familyId, familyMemberId: familyData.familyMemberId, user_id: familyData.user_id, }, userType: props.userType, userEmail: props.userEmail })
                    .then(res => {
                        console.log("in success")
                        setServerReturn(true)
                        setAlertInfo({ severity: "success", message: "The details were saved!" })
                    }).catch(err => {
                        console.log(err)
                        setServerReturn(true)
                        setAlertInfo({ severity: "error", message: "Error while saving values, please check the entered values" })
                    })
            } else
                setIsFamilyError(true)
        }

    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setServerReturn(false);
    };


    if (familyId === "undefined") {
        return (
            <div className="epr-form">
                {
                    (serverReturn === true) ? <Snackbar open={serverReturn} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alertInfo.severity}>
                            {alertInfo.message}
                        </Alert>
                    </Snackbar> : ""
                }
                <Grid container spacing={3}>
                    <Grid item xs={12} className="flex-icon">
                        <Typography variant="h4" gutterBottom>
                            Personal Information<CallMadeIcon className='heading-icon' style={{ fill: "#2ba9bf" }} fontSize="inherit" />
                        </Typography>
                        <IconButton aria-label="edit" color={editColor} onClick={(e) => handleLabelColor()}>
                            <EditIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            error={isUserError === true && userViewData.firstName === ""}
                            label="First Name"
                            variant="outlined"
                            required
                            fullWidth
                            name="firstName"
                            value={userViewData.firstName}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            label="Maiden Name"
                            variant="outlined"
                            fullWidth
                            name="maidenName"
                            value={userViewData.maidenName}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            error={isUserError === true && userViewData.lastName === ""}
                            label="Last Name"
                            variant="outlined"
                            required
                            fullWidth
                            name="lastName"
                            value={userViewData.lastName}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <TextField
                            error = {isUserError === true && userViewData.address===""}
                            label="Address" 
                            variant="outlined"
                            required id="standard-required"
                            required 
                            fullWidth
                            name = "address"
                            value = {userViewData.address}
                            onChange = {handleUserChange}
                            // className = 'form-input'
                            disabled = {!isEdit}
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <TextField
                            error={isUserError === true && userViewData.address_line1 === ""}
                            label="Address Line1"
                            variant="outlined"
                            required id="standard-required"
                            required
                            fullWidth
                            name="address_line1"
                            value={userViewData.address_line1}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={isUserError === true && userViewData.address_line2 === ""}
                            label="Address Line2"
                            variant="outlined"
                            required id="standard-required"
                            required
                            fullWidth
                            name="address_line2"
                            value={userViewData.address_line2}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            error={isUserError === true && userViewData.address_city === ""}
                            label="City"
                            variant="outlined"
                            required id="standard-required"
                            required
                            fullWidth
                            name="address_city"
                            value={userViewData.address_city}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            error={isUserError === true && userViewData.address_post === ""}
                            label="Post"
                            variant="outlined"
                            required id="standard-required"
                            required
                            fullWidth
                            name="address_post"
                            value={userViewData.address_post}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            error={isUserError === true && userViewData.dob === ""}
                            variant="outlined"
                            label="DOB"
                            required
                            fullWidth
                            name="dob"
                            type="date"
                            value={userViewData.dob.split("T")[0]}
                            // value = "1970-01-01"
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            error={isUserError === true && userViewData.mobile === ""}
                            label="Mobile"
                            variant="outlined"
                            required
                            fullWidth
                            type="number"
                            name="mobile"
                            value={userViewData.mobile}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            error={true}
                            label="Email"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            type="email"
                            name="email"
                            value={userViewData.email}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            error={isUserError === true && userViewData.gpName === ""}
                            label="GP Name"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name="gpName"
                            value={userViewData.gpName}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    {/* <Grid item xs={8}>
                        <TextField
                            error = {isUserError === true && userViewData.gpAddress===""}
                            label="GP Address" 
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name = "gpAddress"
                            value = {userViewData.gpAddress}
                            onChange = {handleUserChange}
                            // className = 'form-input'
                            disabled = {!isEdit}
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <TextField
                            error={isUserError === true && userViewData.gpAddress_line1 === ""}
                            label="GP Address Line1"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name="gpAddress_line1"
                            value={userViewData.gpAddress_line1}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={isUserError === true && userViewData.gpAddress_line2 === ""}
                            label="GP Address Line2"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name="gpAddress_line2"
                            value={userViewData.gpAddress_line2}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            error={isUserError === true && userViewData.gpAddress_city === ""}
                            label="GP City"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name="gpAddress_city"
                            value={userViewData.gpAddress_city}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            error={isUserError === true && userViewData.gpAddress_post === ""}
                            label="GP Address Post"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name="gpAddress_post"
                            value={userViewData.gpAddress_post}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            // error = {true}
                            label="Disclose Identity"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name="discloseIdentity"
                            value={userViewData.discloseIdentity === "true" ? "Yes" : "No"}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            // error = {true}
                            label="Receive Letter"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name="receiveLetter"
                            value={userViewData.receiveLetter === "true" ? "Yes" : "No"}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            // error = {true}
                            label="Form completed"
                            variant="outlined"
                            required id="standard-required"
                            fullWidth
                            name="disableForm"
                            value={userViewData.disableForm === "true" ? "Yes" : "No"}
                            onChange={handleUserChange}
                            // className = 'form-input'
                            disabled={true}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" error={isUserError === true && !changedUserData.isUserDateConfirmed === true}>
                            <FormLabel ><Typography variant="h6" gutterBottom>
                                Have you confirmed the DOB of the Proband?
                            </Typography></FormLabel>
                            <RadioGroup aria-label="userDate" name="isUserDateConfirmed" value={userViewData.isUserDateConfirmed} onChange={handleUserChange}>
                                <FormControlLabel value={"true"} control={<Radio />} label="Yes" />
                                <FormControlLabel value={"false"} control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <Button
                            label="Save"
                            color='primary'
                            variant='outlined'
                            className="btn"
                            disabled={!isEdit}
                            onClick={submitChanged}
                            fullWidth

                        >Save</Button>
                    </Grid>
                </Grid>
            </div>
        )
    } else {
        return (
            <div className="epr-form">
                {
                    (serverReturn === true) ? <Snackbar open={serverReturn} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity={alertInfo.severity}>
                            {alertInfo.message}
                        </Alert>
                    </Snackbar> : ""
                }
                {/* <Grid item xs={12} >
                    <Typography variant="h5" gutterBottom>
                    {CONSTANTS.relations[item.relationship]}
                    </Typography>
                </Grid> */}
                <Grid container spacing={3}>
                    <Grid item xs={12} className="flex-icon">
                        <Typography variant="h4" gutterBottom>
                            Personal Information
                        </Typography>
                        <IconButton aria-label="edit" color={editColor} onClick={(e) => handleLabelColor()}>
                            <EditIcon />
                        </IconButton>
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            error={isFamilyError === true && familyViewData.firstName === ""}
                            label="First Name"
                            variant="outlined"
                            required
                            fullWidth
                            name="firstName"
                            value={familyViewData.firstName}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            label="Maiden Name"
                            variant="outlined"
                            fullWidth
                            name="maidenName"
                            value={familyViewData.maidenName}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <TextField
                            error={isFamilyError === true && familyViewData.lastName === ""}
                            label="Last Name"
                            variant="outlined"
                            required
                            fullWidth
                            name="lastName"
                            value={familyViewData.lastName}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            // error = {true}
                            label="Mother's Name"
                            variant="outlined"
                            fullWidth

                            name="motherName"
                            value={familyViewData.motherName}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            // error = {true}
                            label="Father's Name"
                            variant="outlined"
                            fullWidth
                            name="fatherName"
                            value={familyViewData.fatherName}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            error={isFamilyError === true && familyViewData.dob === ""}
                            label="Date of Birth"
                            variant="outlined"
                            fullWidth
                            required
                            type="date"
                            name="dob"
                            value={familyViewData.dob.split("T")[0]}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            // error = {true}
                            label="Date of Death"
                            variant="outlined"
                            fullWidth
                            type="date"
                            name="dod"
                            value={!familyViewData.dod === true ? "" : familyViewData.dod.split("T")[0]}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            helperText="If suffered/suffering from cancer"
                            label="Place where cancer occured"
                            variant="outlined"
                            fullWidth
                            name="cancerPlace"
                            value={familyViewData.cancerPlace}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
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
                            value={familyViewData.cancerAge}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            helperText="If suffered/suffering from cancer"
                            label="Hospital where cancer was treated and name of specialist"
                            variant="outlined"
                            fullWidth
                            multiline
                            name="cancerTreated"
                            value={familyViewData.cancerTreated}
                            onChange={handleFamilyChange}
                            // className = 'form-input'
                            disabled={!isEdit}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl component="fieldset" error={isFamilyError === true && !changedFamilyData.isfamilyMemberDateConfirmed === true} >
                            <FormLabel ><Typography variant="h6" gutterBottom>
                                Have you confirmed the DOB and/or DOD of the family member?*
                            </Typography></FormLabel>
                            <RadioGroup aria-label="familyDateConfirmed" name="isfamilyMemberDateConfirmed" value={!changedFamilyData === true ? "" : familyViewData.isfamilyMemberDateConfirmed} onChange={handleFamilyChange}>
                                <FormControlLabel value={"true"} control={<Radio />} label="Yes" />
                                <FormControlLabel value={"false"} control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}></Grid>
                    <Grid item xs={4}>
                        <Button
                            label="Save"
                            color='primary'
                            variant='outlined'
                            className="btn"
                            disabled={!isEdit}
                            onClick={submitChanged}
                            fullWidth

                        >Save</Button>
                    </Grid>
                </Grid>

            </div>
        )
    }

}

export default UserInfo
