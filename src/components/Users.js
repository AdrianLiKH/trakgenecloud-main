import React, { useState,useEffect } from 'react'
import MaterialTable from 'material-table'
import axios from '../axios'
import {CONSTANTS} from './Constants'

//material ui 
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import { useHistory} from 'react-router-dom'

//icons
import PersonIcon from '@material-ui/icons/Person';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GroupIcon from '@material-ui/icons/Group';
import CallMadeIcon from '@material-ui/icons/CallMade';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';


const Users = (props) => {

    //state
    const [userInfo,setUserInfo] = useState([])
    const [viewInfo,setViewInfo] = useState([])
    const [userId, setUserId] = useState([])
    const [open, setOpen] = useState(false);
    const [deleteMember, setDeleteMember] = useState({isProband:false,proBandId:'',familyMemberId:''});
    
    //declaring variables
    const userColumn= [
        {   title: 'First Name', 
            field: 'firstName', 
            render:rowData=>{
                return capitalizeLetter(rowData.firstName)
            }   
        },
        {   title: 'Last Name',
            field: 'lastName',
            render:rowData=>{
                return capitalizeLetter(rowData.lastName)
            }   
        },
        {
            title: 'Status',
            field: 'status',
            type: 'string',
            render:rowData=>{
                if(rowData.status === "inProgress" && !rowData.proBandId === false){
                    return (
                        <div style={{backgroundColor:"#F7F48B",padding:'6%',borderRadius:"3px",minWidth:'100%',textAlign:"center"}}>In Progress</div>
                    )
                }else if(rowData.status === "complete" && !rowData.proBandId === false){
                    return (
                        <div style={{backgroundColor:"#A1DE93",padding:'6%',borderRadius:"3px",minWidth:'100%',textAlign:"center"}}>Completed</div>
                    )
                }else{
                    if( !rowData.proBandId === false){
                        return (
                            <div style={{backgroundColor:"#70A1D7",padding:'6%',borderRadius:"3px",minWidth:'100%',textAlign:"center"}}>Sent</div>
                        )        
                    }
                   
                }

                
            }
        },
        { 
            title: 'Relationship', 
            field: 'relationship',
            type: 'string',
            render:rowData=>{
                return CONSTANTS.relations[rowData.relationship]
            } 
        },
        { title: 'TrakGene Id', field: 'trakGeneId' },
        { title: 'Family Id', field: 'familyId' },
        { title: 'DOB', field: 'dob', type:'date' },
        { title: 'Number', field: 'mobile', type: 'numeric' },
        { title: 'Email', field: 'email', type: 'string' },
        {   title: 'Gender',
            field: 'gender',
            render:rowData=>{
                return capitalizeLetter(rowData.gender)
            }   
        },
        
    ]

    const history = useHistory();

    
    
    
    // const [geneticColumn,setGeneticColumn] = ([
    //     { title: 'Personal Id', field: 'personalId' },
    //     {   title: 'Jewish',
    //         field: 'isJewish',
    //         render:rowData=>{
    //             return capitalizeLetter(rowData.isJewish)
    //         }   
    //     },
    //     {   title: 'Is woman with Cancer',
    //         field: 'isWomanCancer',
    //         render:rowData=>{
    //             return capitalizeLetter(rowData.isWomanCancer)
    //         }   
    //     },

    // ])


    //functions

    //Get proband data for all forms submitted
    useEffect(()=>{
        let path = '/admin/userData/getUsers'
        setUserInfo([])
        setViewInfo([])
        setUserId([])
        axios.post(path, {userEmail:props.userEmail})
            .then(res => {
                console.log("Users received")
                setUserInfo(res.data)
                setViewInfo(res.data)
                let id= []
                if(res.data){
                    res.data.map((item,i)=>{
                        id.push(item._id)
                    }) 
                }
                setUserId(id)
            }).catch(err => { 
                console.log("Inside error")
                console.log(err)
        })
    },[])

  
    //Get family information
    const getFamilyInfo = ()=>{
        //defining path
        let path = '/admin/userData/getFamilyData'
         axios.post(path,{userId})
            .then(res => {
                console.log("Family data received")
                if(res.data){
                    setViewInfo([...userInfo,...res.data])
                }
               
            }).catch(err => { 
                console.log("Inside error")
                console.log(err)
        })

    }

    //download file
    const downloadFile = (_id, proBandId)=>{
        //defining path
        let path = '/admin/userData/getXML'

         axios.post(path,{_id,proBandId})
            .then(response => {
                //new
                const blob = new Blob([response.data], {type:'text/xml'});
                let a = document.createElement('a');
                a.download = `trak-${proBandId}.xml`
                a.href = URL.createObjectURL(blob);
                a.click();


            //    response.blob().then(blob => {
			// 		let url = window.URL.createObjectURL(blob);
			// 		let a = document.createElement('a');
			// 		a.href = url;
			// 		a.download = 'employees.json';
			// 		a.click();
			// 	});

                // window.location.href = response.url;
            }).catch(err => { 
                console.log("Inside error")
                console.log(err)
        })

        // console.log(rowdata)

    }

    //set view to proband only
    const setProbandView = ()=>{
        setViewInfo([...userInfo])
    }

    //capitalize first letter of a string
    const capitalizeLetter = (word)=>{
        if(typeof word !== 'string') 
            return ''
        return word.charAt(0).toUpperCase() + word.slice(1)
    }
    
    const handleHistory = (email) =>{
        history.push(`/admin/patientInfo?email=${email}`)
    }

    const handleHistoryPersonal = (email, id, familyId)=>{
        history.push(`/admin/userInfo?email=${email}&id=${id}&familyId=${familyId}`)
    }

    //dialog
    const handleClickOpen = (email,proBandId,familyMemberId) => {
        if(email){
            setDeleteMember({isProband:true,proBandId:proBandId,familyMemberId:null})
        }else{
            setDeleteMember({isProband:false,proBandId:null,familyMemberId:familyMemberId})
        }
        setOpen(true);
    };

    const handleClose = () => {
            setOpen(false);
    };

    const handleDelete = ()=>{
        //defining path
        let path = '/admin/userData/deleteFamily'
         axios.post(path,{deleteMember})
            .then(res => {
                console.log("Family member deleted")
                setOpen(false);
                if(deleteMember.isProband === true){
                    let id_array = deleteMember.proBandId.split('-')
                    let familyId = id_array[0]+ '-'+ id_array[1]
                    let newView = viewInfo.filter((item, index)=> item.familyId !== familyId)
                    setUserInfo(newView)
                    setViewInfo(newView)

                }else{
                    let newView = viewInfo.filter((item, index)=> item.familyMemberId !== deleteMember.familyMemberId)
                    setUserInfo(newView)
                    setViewInfo(newView)
                }
               
            }).catch(err => { 
                console.log(err)
                setOpen(false);
        })
    };


    return (
        <div className='probandTable' style={{ maxWidth: '100%'}}>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this family member's details?"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This action will permanently delete this family member's details, incase of a proband, all family details will be deleted.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    No
                </Button>
                <Button onClick={handleDelete} color="primary" autoFocus>
                    Yes
                </Button>
                </DialogActions>
            </Dialog>
            <MaterialTable
            columns={userColumn}
            data={viewInfo}
            title="Proband Information"
            actions = {[
                {
                    icon: ()=> <VisibilityIcon/>,
                    tooltip: 'View user details',
                    onClick:(e,rowData)=> handleHistoryPersonal(rowData.email, rowData.proBandId, rowData.familyMemberId)
                },
                
                rowData => ({
                     icon: ()=> <CallMadeIcon 
                        style={{fill:"#2ba9bf"}}
                    />,
                    tooltip: 'View information submitted by Proband',
                    onClick: (e,rowData)=> handleHistory(rowData.email),
                    hidden:(!rowData.proBandId === true)?true:false
                }),
                rowData => ({
                    icon: ()=> <GetAppIcon/>,
                    tooltip: 'Download data as XML',
                    onClick: (e,rowData)=> downloadFile(rowData._id, rowData.proBandId),
                    hidden:(!rowData.proBandId === true)?true:false
                }),
                 rowData => ({
                    icon: ()=> <DeleteIcon style={{color:'red'}}/>,
                    tooltip: 'Delete the family member',
                    onClick: (e,rowData)=> handleClickOpen(rowData.email,rowData.proBandId,rowData.familyMemberId)
                }),
                {
                    icon: ()=><PersonIcon/>,
                    tooltip: 'Proband View',
                    isFreeAction: true,
                    onClick: (event) => setProbandView()
                },
                {
                    icon: ()=><GroupIcon/>,
                    tooltip: 'All family members',
                    isFreeAction: true,
                    onClick: (e) => getFamilyInfo()
                },
                
 
            ]}
            // components={{
            //     Action: props =>(
            //         <Button
            //             onClick = {e => props.action.onClick(e, props.data)}
            //             color='primary'
            //             variant = 'text'
            //             style = {{textTransform:'none'}}
            //             size='small'
            //         >
            //             View
            //         </Button>
            //     )
            // }}
            />
      </div>
    )
}

export default Users
