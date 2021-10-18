import React, {useState} from 'react'
import axios from '../../axios'
import {Route, Switch, useHistory} from "react-router-dom"
import {Link} from 'react-router-dom'
//material ui files
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import logo from 'src/assets/images/trakgeneLogo.png'
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
//icons - materialui
import LinkIcon from '@material-ui/icons/Link';
import HomeIcon from '@material-ui/icons/Home';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CreateIcon from '@material-ui/icons/Create';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

//importing files
import GenerateLink from '../GenerateLink'
import Users from '../Users'
import PatientRecord from '../PatientRecord'
import UserInfo from '../UserInfo'
import Home from '../Home'
import Settings from '../Settings'
import AddUser from '../AddUsers'

import { APICONSTANTS, CONSTANTS } from 'src/components/Constants'
import {UserContext} from 'src/store/ContextStore'

const drawerWidth = 240;
const minAppbarHeight = '80px';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'static',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        marginBottom:'40px',
        
    },
    chevIcon:{
        minHeight:minAppbarHeight,
        '&:hover':{
            background: 'transparent'
        }
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    logo:{
        maxWidth:190,
        marginRight:'10px',
        marginLeft:'auto'
    },
    footer:{
        fontSize:'0.75rem',
        fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'",
    },
    itemList:{
        height:'100%'
    },
    version:{
        position:'absolute',
        bottom: '1rem'
    }
    
    
}));


const AdminPanel = (props) => {
    const {setUser} = React.useContext(UserContext)
    const history = useHistory()

    //state
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const classes = useStyles();

    const theme = useTheme();

    //open-close for dialog
    const handleClickOpen = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleCloseSignout = async() => {
        axios.get(APICONSTANTS.logout)
        .then(res => {
            history.push(CONSTANTS.signinPath)
            setUser(null)
        })
    }
    
    //open-close functions for sidebar
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

   


    return (
        <>
            <div className={classes.root}>
                <CssBaseline />
                <div className="appbar">
                    <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                        })}
                        style={{backgroundColor:"white",color:"#2ba9bf",marginBottom:"40px",minHeight:minAppbarHeight}}
                    >
                        <Toolbar>
                            <Box display='flex' flexGrow={1}>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    className={clsx(classes.menuButton, {
                                    [classes.hide]: open,
                                    })}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Typography variant="h5" color="inherit" className="heading" >
                                    Family History Web App
                                </Typography>
                            </Box>
                            <IconButton edge="end" className={classes.menuButton} color="inherit" aria-label="menu">
                                <img src={logo} alt="logo" className='logo' />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </div>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                    })}
                    classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                    }}
                >
                    <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose} className={classes.chevIcon}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                    <Divider />
                    </div>
                    
                    <List className={classes.itemList}>
                        <div >
                            <Link to="/admin/home" style={{ textDecoration: 'none',color:'#000' }}>
                                <ListItem button key="home">
                                    
                                        <ListItemIcon> <HomeIcon /></ListItemIcon>
                                    <ListItemText primary="Home" />
                                </ListItem>
                            </Link>

                            <Link to="/admin/generateLink" style={{ textDecoration: 'none',color:'#000' }}>
                                <ListItem button key="generateLink">
                                        <ListItemIcon><LinkIcon /></ListItemIcon>
                                    <ListItemText primary="Generate Link" />
                                </ListItem>
                            </Link>

                            <Link to="/admin/users" style={{ textDecoration: 'none',color:'#000' }}>
                                <ListItem button key="users">
                                        <ListItemIcon><AccountBoxIcon /></ListItemIcon>
                                    <ListItemText primary="Families" />
                                </ListItem>
                            </Link>

                            {(props.userType === 'admin')?
                                <Link to="/admin/pedigree" style={{ textDecoration: 'none',color:'#000' }}>
                                <ListItem button key="pedigreeTool">
                                    <ListItemIcon><CreateIcon /></ListItemIcon>
                                    <ListItemText primary="Pedigree Tool" />
                                </ListItem></Link>:''
                            }
                            

                            {(props.userType === 'admin')?
                                <Link to="/admin/settings" style={{ textDecoration: 'none',color:'#000' }}>
                                    <ListItem button key="settings">
                                        <ListItemIcon><SettingsIcon /></ListItemIcon>
                                    <ListItemText primary="Settings" />
                                </ListItem></Link>:''
                            }
                        
                            {(props.userType === 'admin')?
                                <Link to="/admin/addUser" style={{ textDecoration: 'none',color:'#000' }}>
                                <ListItem button key="addUser">
                                        <ListItemIcon><PersonAddIcon /></ListItemIcon>
                                    <ListItemText primary="Add Users" />
                                </ListItem></Link>:''
                            }
                            
                            
                            <ListItem button key="signout" onClick = {handleClickOpen}>
                                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                                <ListItemText primary="Signout" />
                            </ListItem>
                        
                        </div>
                        <ListItem button key="version" className={classes.version}>
                            <Typography variant="h6" color="inherit"  className={classes.footer}>
                            Ver 1.1
                            </Typography>
                        </ListItem>

                        
                        
                           
                        
                        
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Switch>
                        <Route exact path="/admin/">
                            <Home
                                userEmail={props.email}
                                userType = {props.userType}
                            />
                        </Route>
                        <Route exact path="/">
                            <Home
                                userEmail={props.email}
                                userType = {props.userType}
                            />
                        </Route>
                        <Route path="/admin/home">
                            <Home
                                userEmail={props.email}
                                userType = {props.userType}
                            />
                        </Route>
                        <Route path="/admin/generateLink">
                            <GenerateLink
                                userEmail={props.email}
                                userType = {props.userType}
                            />
                        </Route>
                        <Route path="/admin/users">
                            <Users
                                userEmail={props.email}
                                userType = {props.userType}
                            />
                        </Route>
                        <Route path="/admin/patientInfo">
                            <PatientRecord
                                userEmail={props.email}
                                userType = {props.userType}
                            />
                        </Route>
                        <Route path="/admin/pedigree">
                        </Route>
                        <Route path="/admin/userinfo">
                            <UserInfo
                                userEmail={props.email}
                                userType = {props.userType}
                            />
                        </Route>
                        <Route path="/admin/settings">
                            {(props.userType === 'admin')?
                                <Settings
                                    userEmail={props.email}
                                    userType = {props.userType}
                                />:""
                            }
                        </Route>
                        <Route path="/admin/addUser">
                             {(props.userType === 'admin')?
                                <AddUser
                                    userEmail={props.email}
                                    userType = {props.userType}
                                />:""
                            }
                            
                        </Route>
                    </Switch>
                    
                </main>
                 <Dialog
                    open={dialogOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to sign out?"}</DialogTitle>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        NO
                    </Button>
                    <Button onClick={handleCloseSignout} color="primary" autoFocus>
                        Yes
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
            
            
        </>
    )
}

export default AdminPanel
