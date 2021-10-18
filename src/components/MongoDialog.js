import React, {useState} from 'react'
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const MongoDialog = (props) => {

    //state
    const [mongoDetails, setMongoDetails] = useState({mongoDbType:"MongoDB",userName:"",mongoPassword:"",clusterName:"",databaseName:"",port:""})


    //styles for Material UI
    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            margin: 0,
            padding: theme.spacing(2),
        },
        logo:{
            maxWidth:190,
            marginRight:'10px',
            marginLeft:'auto'
        },
        
        menuButton: {
            marginRight: theme.spacing(2),
        },
        closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
        },
    }));


    //MaterialUI dialog box functions
    const DialogTitle = withStyles(useStyles)((props) => {
    const { children, classes, onClose, ...other } = props;
        return (
            <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
                </IconButton>
            ) : null}
            </MuiDialogTitle>
        );
    });

    const DialogContent = withStyles((theme) => ({
        root: {
            padding: theme.spacing(2),
        },
    }))(MuiDialogContent);

    const DialogActions = withStyles((theme) => ({
        root: {
            margin: 0,
            padding: theme.spacing(1),
        },
    }))(MuiDialogActions);

    const handleDialogClose = () => {
        props.setOpen(false);
    };

    const handleMongo = (e)=>{
        const name = e.target.name
        const value = e.target.value
        setMongoDetails({...mongoDetails,[name]:value})
    }



    return (
        <div>
            <Dialog onClose={handleDialogClose}             aria-labelledby="customized-dialog-title" open={props.open}>
                <DialogTitle id="customized-dialog-title" onClose={handleDialogClose}>
                    Set MongoDB details
                </DialogTitle>
                    
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className = "dialog-input">
                            <FormControl component="fieldset" >
                            <FormLabel component="legend" className="form-label">Type of database </FormLabel>
                                <RadioGroup aria-label="userType" name="mongoDbType" value={mongoDetails.mongoDbType} onChange={handleMongo}>
                                    <FormControlLabel value="MongoDB" control={<Radio />} label="MongoDB" />
                                    <FormControlLabel value="MongoDBAtlas" control={<Radio />} label="MongoDB Atlas" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} className = "dialog-input">
                            <TextField
                                    label="MongoDB Username" 
                                    variant="outlined"
                                    fullWidth
                                    name = "userName"
                                    value={mongoDetails.userName}
                                    onChange={handleMongo}
                                    
                                    // value = {item.fatherName}
                                    // onChange = {(e)=>handleFamilyChange(e, index)}
                                    // className = 'form-input'
                                />
                        </Grid>

                        <Grid item xs={6} className = "dialog-input">
                            <TextField
                                    label="MongoDB Password" 
                                    variant="outlined"
                                    fullWidth
                                    name = "mongoPassword"
                                    type = "password"
                                    value={mongoDetails.mongoPassword}
                                    onChange={handleMongo}
                                    // value = {item.fatherName}
                                    // onChange = {(e)=>handleFamilyChange(e, index)}
                                    // className = 'form-input'
                                />
                        </Grid>
                        <Grid item xs={6} className = "dialog-input">
                            <TextField
                                    label="MongoDB Cluster Name" 
                                    variant="outlined"
                                    fullWidth
                                    name = "clusterName"
                                    value={mongoDetails.clusterName}
                                    onChange={handleMongo}
                                    // value = {item.fatherName}
                                    // onChange = {(e)=>handleFamilyChange(e, index)}
                                    // className = 'form-input'
                                />
                        </Grid>

                        <Grid item xs={6} className = "dialog-input">
                            <TextField
                                    label="MongoDB Database Name" 
                                    variant="outlined"
                                    fullWidth
                                    name = "databaseName"
                                    value={mongoDetails.databaseName}
                                    onChange={handleMongo}
                                    // value = {item.fatherName}
                                    // onChange = {(e)=>handleFamilyChange(e, index)}
                                    // className = 'form-input'
                                />
                        </Grid>

                        {mongoDetails.mongoDbType === "MongoDB"?
                            <Grid item xs={6} className = "dialog-input">
                            <TextField
                                    label="Port Number" 
                                    variant="outlined"
                                    fullWidth
                                    name = "port"
                                    type = "number"
                                    value={mongoDetails.port}
                                    onChange={handleMongo}
                                    // value = {item.fatherName}
                                    // onChange = {(e)=>handleFamilyChange(e, index)}
                                    // className = 'form-input'
                                />
                        </Grid>:""
                        }
                        <Grid item xs={6}><Paper></Paper></Grid>
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button  onClick={handleDialogClose} color="primary">
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MongoDialog
