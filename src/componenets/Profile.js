import React, { Component, useState, useEffect, useContext } from 'react';
import {
    Button, Typography, Paper, FormLabel, TextField, Snackbar, Checkbox, IconButton, MenuItem,
    Icon, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, CircularProgress, Tooltip, 
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import { UserContext } from '../context/UserContext'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import moment from 'moment'
import { Redirect } from "react-router-dom"
import Registration from './Registration'
import { auth, firebaseGetUserInfo} from '../api/Firebase'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import GroupIcon from '@material-ui/icons/Group'
import FavoriteIcon from '@material-ui/icons/Favorite';


export default function Profile({ history, match }) {

    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [profileUser, setProfileUser] = useState('')


    const theme = useTheme()
    
    const { user } = useContext(UserContext)

    useEffect(() => {
        firebaseGetUserInfo(match.params.id)
            .then((userInfo) => setProfileUser(userInfo))
            .catch((error) => {
                setMessage('Error retrieving user info. Please contact Kindle support')
                setOpenError(true)
            })
    }, [])

    const useStyles = makeStyles(() => ({
        root: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: profileUser ? 'flex-start' : 'center',
            alignItems: 'center',
            padding: theme.spacing(2)
        },
        margin: {
            margin: theme.spacing(1)
        },
        personalPaper: {
            width: '60%', 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: theme.spacing(2)
        }, 
        avatar: {
            width: theme.spacing(20),
            height: theme.spacing(20),
            marginRight: theme.spacing(2)
        }, 
        personalInfo: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            height:'80%'
        }, 
        personalIcon: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

        }, 
        personalButtons: {
            flexGrow: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'flex-end',
        },
        aboutPaper: {
            width: '60%', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2)
        }
    }))

    const classes = useStyles()

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
        setMessage('')
    }

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setMessage('')
    }

    const handleHire = () => {

    }

   
    // if (!user) {
    //     return <Redirect to={'/signin'} />
    // } else {
    //     if (!user.complete) {
    //         return <Registration history={history}/>
    //     } else {
            return (
                <div className={classes.root}>
                    {profileUser
                        ? <>
                            <Paper className={classes.personalPaper}>
                                <Avatar alt="profile avatar" src={profileUser.avatar} className={classes.avatar}/>
                                <div className={classes.personalInfo}>
                                    <Typography variant='h6' color='primary'>{profileUser.firstName} {profileUser.lastName}</Typography>
                                    <div className={classes.personalIcon}>
                                        <Tooltip title="Location">
                                            <LocationOnIcon fontSize="small" color='secondary' style={{marginRight: theme.spacing(2)}}/>
                                        </Tooltip>
                                        <Typography variant='caption' color='primary'>{profileUser.address.suburb.charAt(0) + profileUser.address.suburb.slice(1).toLowerCase()}, {profileUser.address.stateAus}</Typography>
                                    </div>
                                    <div className={classes.personalIcon}>
                                        <Tooltip title="Membership date">
                                            <IconButton>
                                            <GroupIcon fontSize="small" color='secondary' />
                                            </IconButton>
                                            
                                        </Tooltip>
                                        <Typography variant='caption' color='primary'>{moment(new Date(profileUser.membership)).format("DD/MM/YYYY")}</Typography>
                                    </div>
                                </div>
                                <div className={classes.personalButtons}>
                                    <Button 
                                        variant='outlined' 
                                        color='secondary'
                                        size='small'
                                        onClick={handleHire}
                                    >
                                        Hire
                                    </Button>
                                    <Tooltip title='Add to your shortlist'>
                                        <FavoriteIcon fontSize="large" color='secondary' style={{marginRight: theme.spacing(1)}}/>
                                    </Tooltip>
                                </div>
                            </Paper>

                            <Paper className={classes.aboutPaper}> 
                                <Typography variant='subtitle1' color='primary'>About</Typography>
                                <div style={{padding: theme.spacing(2)}}>
                                    <Typography variant='subtitle2' color='primary' style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(1)}}>Biograpghy</Typography>
                                    <Typography variant='body' align='justify'>{profileUser.biograpghy}</Typography>
                                    <Typography variant='subtitle2' color='primary' style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(1)}}>Place of birth</Typography>
                                    <Typography variant='body' >{profileUser.birthCountry}</Typography>
                                    <Typography variant='subtitle2' color='primary' style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(1)}}>Gender</Typography>
                                    <Typography variant='body'>{profileUser.gender}</Typography>
                                    <Typography variant='subtitle2' color='primary' style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(1)}}>Languages</Typography>
                                    <ul>
                                        {profileUser.languages.map((language, i) => (
                                            <li key={i}>{language}</li>
                                        ))}
                                    </ul>
                                    <Typography variant='subtitle2' color='primary' style={{marginTop: theme.spacing(2), marginBottom: theme.spacing(1)}}>Interests and hobbies</Typography>
                                    <ul>
                                        {['Soccer', 'Surfing', 'Chess', 'Watching movies'].map((language, i) => (
                                            <li key={i}>{language}</li>
                                        ))}
                                    </ul>
                                </div>
                            </Paper>

                            
                            <Snackbar open={openError} autoHideDuration={6000} onClose={handleErrorClose}>
                                <Alert onClose={handleErrorClose} severity='error'>
                                    {message}
                                </Alert>
                            </Snackbar>
                            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleSuccessClose}>
                                <Alert onClose={handleSuccessClose} severity='success'>
                                    {message}
                                </Alert>
                            </Snackbar>
                        </>

                        : <CircularProgress color="secondary" />

                    }
                   
                </div>
            )
        }
//     }
// }