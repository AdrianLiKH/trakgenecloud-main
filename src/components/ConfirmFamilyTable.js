import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {CONSTANTS} from './Constants'
import { Button } from '@material-ui/core';

const ConfirmFamilyTable = (props) => {
    
    const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    });

    const classes = useStyles();

    //getting family details
    const familyDetails = [...props.children]

    const rows = [];

    function createData(relationship, firstName, maidenName, lastName, motherName,fatherName,dob,alive,dod,cancerPlace,cancerAge,cancerTreated) {
        return { relationship, firstName, maidenName, lastName, motherName,fatherName,dob,alive,dod,cancerPlace,cancerAge,cancerTreated };
    }

    //functions for buttons
    const moveNext = (e)=>{
        e.preventDefault();
        props.nextStep();
    }

    //function to move to previous step
    const movePrev = (e)=>{
        e.preventDefault();
        props.prevStep();
    }

    familyDetails.map((item,index)=>{
        rows.push( createData(CONSTANTS.relations[item.relationship], item.firstName,item.maidenName,item.lastName,item.motherName,item.fatherName,item.dob,item.alive,item.dod, item.cancerPlace,item.cancerAge,item.cancerTreated))
    })


    return (
        <div className="family-table">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Please check the details of your family members
                    </Typography>
                </Grid>        
            </Grid>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Relationship</TableCell>
                        <TableCell align="right">First&nbsp; Name</TableCell>
                        <TableCell align="right">Maiden&nbsp;Name</TableCell>
                        <TableCell align="right">Last&nbsp;Name</TableCell>
                        <TableCell align="right">Mother's&nbsp;Name</TableCell>
                        <TableCell align="right">Father's&nbsp;Name</TableCell>
                        <TableCell align="right">Date&nbsp;of&nbsp;birth </TableCell>
                        <TableCell align="right">Alive</TableCell>
                        <TableCell align="right">Date&nbsp;of&nbsp;death</TableCell>
                        <TableCell align="right">Place&nbsp; where&nbsp; cancer&nbsp; occured</TableCell>
                        <TableCell align="right">Age&nbsp; when&nbsp; cancer&nbsp; occured</TableCell>
                        <TableCell align="right">Place&nbsp; where&nbsp; cancer&nbsp; treated</TableCell>

                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row.relationship}
                        </TableCell>
                        <TableCell align="right">{row.firstName}</TableCell>
                        <TableCell align="right">{row.maidenName}</TableCell>
                        <TableCell align="right">{row.lastName}</TableCell>
                        <TableCell align="right">{row.motherName}</TableCell>
                        <TableCell align="right">{row.fatherName}</TableCell>
                        <TableCell align="right">{row.dob?row.dob.split('T')[0]:null}</TableCell>
                        <TableCell align="right">{row.alive}</TableCell>
                        <TableCell align="right">{row.dod}</TableCell>
                        <TableCell align="right">{row.cancerPlace}</TableCell>
                        <TableCell align="right">{row.cancerAge}</TableCell>
                        <TableCell align="right">{row.cancerTreated}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container spacing={3} alignItems='flex-end' className="table-buttons">    
                <Grid item xs={4}>
                    <Button
                        label = "Continue"
                        color = 'primary'
                        variant = 'outlined'
                        className = "btn"
                        onClick = {moveNext}
                        fullWidth
                    
                    >Continue</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                    label = "Previous"
                    color = 'primary'
                    variant = 'outlined'
                    className = "btn"
                    onClick = {movePrev}
                    fullWidth
                
                >Previous</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button
                    label = "Save"
                    color = 'primary'
                    variant = 'outlined'
                    className = "btn"
                    fullWidth
                
                >Save</Button>
                </Grid>
            </Grid>  
        </div>
    )
}

export default ConfirmFamilyTable
