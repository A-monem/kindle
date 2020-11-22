import React, { useState, useEffect, useContext } from 'react';
import {
    Button, Typography, Paper, FormLabel, TextField, Snackbar, Checkbox, IconButton, MenuItem,
    Icon, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, CircularProgress, Tooltip, Link
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import Rating from '@material-ui/lab/Rating';
import { UserContext } from '../context/UserContext'
import 'date-fns';
import { Redirect } from "react-router-dom"
import Registration from './Registration'
import { firebaseGetAllUsers } from '../api/Firebase'

const UserCard = ({ profile, history }) => {

    useEffect(() => {
        //console.log(profile.data.biograpghy.split('').slice(0, 100).join(''))
    }, [])

    const theme = useTheme()

    const useStyles = makeStyles(() => ({
        profileCardPaper: {
            width: '60%', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2)
        },
        profileCardHeader: {
            display: 'flex',
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        },
        avatar: {
            width: theme.spacing(10),
            height: theme.spacing(10),
        },
        margin: {
            margin: theme.spacing(2)
        }
    }))

    const classes = useStyles()

    return(
        <Paper className={classes.profileCardPaper}>
            <div className={classes.profileCardHeader}>
                <Avatar alt="profile avatar" src={profile.data.avatar} className={classes.avatar}/>
                <div className={classes.margin}>
                    <Typography variant='subtitle1' color='primary'><Link onClick={() => history.replace(`/profile/${profile.id}`)}>{profile.data.firstName} {profile.data.lastName}</Link></Typography>
                    <Rating name="read-only" size='small' value={3} readOnly />
                </div>
            </div>
            <Typography variant='caption' align='justify'>{profile.data.biograpghy.split('').slice(0, 200).concat([' ...']).join('')}</Typography>
        </Paper>
    )
}

const UsersList = ({ profiles, history }) => {
    return(
        <>
            {
                profiles.map((profile, i) => (
                    <UserCard key={i} profile={profile} history={history}/>
                ))
            }
        </>
    )
}


export default function Search({ history }) {

    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [profiles, setProfiles] = useState([])


    const theme = useTheme()

    const { user } = useContext(UserContext)

    useEffect(() => {

        try {
            firebaseGetAllUsers(user.type)
                .then(users => setProfiles(users.filter(user => user.data.complete === true)))
                .catch((error) => {
                    setOpenError(true);
                    setMessage('Error retrieving users. Please contact Kindle supoprt')
                })
        } catch (error) {
            console.log('error from try catch block', error)
        }

    }, [])

    const useStyles = makeStyles(() => ({
        root: {
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: theme.spacing(2)
        },
        margin: {
            margin: theme.spacing(1)
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

   
    if (!user) {
        return <Redirect to={'/signin'} />
    } else {
        if (!user.complete) {
            return <Registration history={history}/>
        } else {
            return (
                <div className={classes.root}>
                    {
                        profiles.length > 0
                        ? <UsersList profiles={profiles} history={history}/>
                        : <CircularProgress color="secondary" />
                    }
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
                </div>
            )
        }
    }
}
