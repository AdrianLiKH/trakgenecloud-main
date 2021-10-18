import React from 'react'
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const Instructions = (props) => {

    //styling func
    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            '& > * + *': {
            marginTop: theme.spacing(2),
            },
        },
        }));

    const classes = useStyles();

    //function to move to next step
    const moveNext = (e)=>{
        e.preventDefault();
        props.nextStep();
    }
    
    if(props.isTokenVerified === false){
        return(
             <div className={classes.root}>
        <Alert severity="error">The link you are using is no longer valid!</Alert>
        </div>
        )
    }
    else{
        return (
            <div className="userInstructions" style={{paddingTop:"50px"}}>
                <Typography variant="h4" gutterBottom >
                    Please note the following when completing the questionnaire:
                </Typography>
                <form >
                    
                    <ul>
                        <li>
                            <Typography variant="h6" gutterBottom>
                                Please give us details of those family members who have not had cancer. This is important in assessing your cancer risk.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="h6" gutterBottom>
                                Try to complete all sections, if some are not relevant then please put N/A for not applicable.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="h6" gutterBottom>
                                Some  first  names  can  be  used  for  males  or  females,  or  are  unusual.  Please  could  you  put Male or Female in the appropriate column.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="h6" gutterBottom>
                                The more details you provide, the more accurate your assessment can be
                            </Typography>
                        </li>
                    </ul>
                            

                    <Button
                        label = "Continue"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {moveNext}                    
                    >Continue</Button>
                    
                </form>
            </div>
        )
    }

    
}

export default Instructions
