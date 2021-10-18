import React,{useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import ChildForm from './ChildForm'
import {CONSTANTS} from './Constants'
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { Alert} from '@material-ui/lab';



//style for button
const useStylesButton = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const ChildrenInfo = (props) => {
    const classes = useStylesButton();
    
    const [relation, setRelation] = React.useState("")
    //making change 
    
    const [isError, setIsError] = useState(false)

    //making change 1,using props original:React.useState([])
    const [childFormValues, setChildFormValues] = React.useState(props.children)

    //snackbar
    const [relationError, setRelationError] = React.useState(false)
    const [alertInfo, setAlertInfo] = useState({severity:"error", message:"Please select a relation before adding"})

    const handleChange = () => {
       props.setChildren([...childFormValues])
    }

    //snackbar close
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setRelationError(false);
    };

    //function to check empty values
    const checkEmptyVals = (array,obj, dependentVals) =>{
        let val = false
        if(array === null){
            obj.map((item,index)=>{
                if(item["relationship"] === "halfSister" || item["relationship"] === "halfBrother")
                for (let i = 0; i < dependentVals.length; i++) {
                    val = val || item[dependentVals[i]] === "" 
                }
            })
            return val
        }else{
            obj.map((item,index)=>{
                for (let i = 0; i < array.length; i++) {
                    val = val || item[array[i]] === "" 
                }
            })
            return val
        }

        
    }

    //function to move to next step
    const moveNext = (e)=>{
        e.preventDefault();
        handleChange();
        let currentVals = ([...childFormValues])
        const valuesToCheck = ["relationship", "firstName", "lastName", "dob", "alive"]
        const dependentValues = ["motherName", "fatherName"]
        if(checkEmptyVals(valuesToCheck, currentVals)){
            setIsError(true)
        }else if(checkEmptyVals(null,currentVals, dependentValues)){
            setIsError(true)
        }else
            props.nextStep();
    }

    const sendData = (e)=>{
        e.preventDefault();
        handleChange();
        let currentVals = ([...childFormValues])
        const valuesToCheck = ["relationship", "firstName", "lastName", "dob", "alive"]
        const dependentValues = ["motherName", "fatherName"]
        if(checkEmptyVals(valuesToCheck, currentVals)){
            setIsError(true)
        }else if(checkEmptyVals(null,currentVals, dependentValues)){
            setIsError(true)
        }else{
            props.saveData(childFormValues);
            props.setStep(6);
        }
            
    }
    //function to move to previous step
    const movePrev = (e)=>{
        e.preventDefault();
        handleChange()
        props.prevStep();
    }

    //to check whether to disable buttons
    let isDisable = false
    if(props.disableButton)
        isDisable = props.disableButton

    const addChildForm = () => {
        if(relation === ""){
            setRelationError(true)
        }else{
            let gender = CONSTANTS.gender[relation]
            const _childFormValues = [...childFormValues]
            _childFormValues.push({relationship: relation,gender:gender,firstName:"", maidenName:"", lastName:"",motherName:"",fatherName:"",dob:"",alive:"",dod:"",cancerPlace:"",cancerAge:"",cancerTreated:""})
            // _childForms.push(
                
            // )
            // setChildForms(_childForms)
            setChildFormValues(_childFormValues)
            setRelation("")
        }
        
    }

    const removeChild = (i)=>{
        let tempChildVals = [...childFormValues]
        tempChildVals.splice(i,1);
        setChildFormValues(tempChildVals)
        console.log(tempChildVals)
    }

    return (
         <>
            {/* <div className={classes.root}> */}
                
                <div className="personal-form">
                    {
                        (relationError === true)? <Snackbar open={relationError} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity={alertInfo.severity}>
                            {alertInfo.message}
                            </Alert>
                        </Snackbar>:""
                    }
                    <h1> Details of family members</h1>
                    <form>
                    {/* form with disabled select */}
                    {childFormValues.map((value, i) => (
                        <>
                        <ChildForm
                            // childInfoMain = {childFormValues}
                            childInfo={childFormValues} 
                            setChildInfo={setChildFormValues}
                            key={i}
                            i={i}
                            isError = {isError}
                            removeChild = {removeChild}
                        />
                        </>
                    ))}
                    {/* select */}
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">Select Family Relation</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            name="relationship"
                            value={relation}
                            onChange={(e) => setRelation(e.target.value)}
                        >
                            {Object.keys(CONSTANTS.relations).map(el => (
                                <MenuItem key={el} value={el}>{CONSTANTS.relations[el]}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Add button */}
                    <Button variant="contained" color="primary" className="btn" onClick={addChildForm}>Add</Button>
                    </form>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                 <Button
                                    label = "Continue"
                                    color = 'primary'
                                    variant = 'outlined'
                                    className = "btn"
                                    onClick = {moveNext}
                                    disabled ={isDisable}
                                    fullWidth
                                
                                >Continue</Button>
                            </Grid>
                            <Grid item xs={4}>
                                 <Button
                                    label = "Back"
                                    color = 'primary'
                                    variant = 'outlined'
                                    className = "btn"
                                    onClick = {movePrev}
                                    disabled ={isDisable}
                                    fullWidth
                                
                                >Previous </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button
                                    label = "Save"
                                    color = 'primary'
                                    variant = 'outlined'
                                    className = "btn"
                                    disabled = {isDisable}
                                    onClick =  {sendData}
                                    fullWidth
                                
                                >Save</Button>
                            </Grid>

                        </Grid> 
                </div>
            {/* </div> */}
        </>
    )
}

export default ChildrenInfo
