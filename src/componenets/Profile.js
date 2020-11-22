import React, { useState, useEffect, useContext } from 'react';
import { Button, Typography, Paper, Snackbar, IconButton, Avatar, CircularProgress, Tooltip } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import { UserContext } from '../context/UserContext'
import 'date-fns';
import moment from 'moment'
import { Redirect } from "react-router-dom"
import Registration from './Registration'
import { firebaseGetUserInfo} from '../api/Firebase'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import GroupIcon from '@material-ui/icons/Group'
import { strings } from '../constants'

const HireWorker = ({ handleHire }) => {

    const useStyles = makeStyles(() => ({
        personalButtons: {
            flexGrow: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'flex-end',
        },
  
    }))

    const classes = useStyles()

    return(
        <div className={classes.personalButtons}>
        <Button
            variant='outlined'
            color='secondary'
            size='small'
            onClick={handleHire}
        >
            Hire
        </Button>
    </div>
    )
   
}

const WorkerProfile = ({ profileUser }) => {
    
    const theme = useTheme()

    const useStyles = makeStyles(() => ({
        workerPaper: {
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        badgePaper: {
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },
        sectionPadding: {
            padding: theme.spacing(2) 
        },
        elementMargin: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1)
        }

    }))

    const classes = useStyles()

    return(
        <>
        <Paper className={classes.workerPaper}>
            <Typography variant='subtitle1' color='primary'>Support work</Typography>
            <div className={classes.sectionPadding}>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Availability</Typography>
                <ul>
                    {profileUser.work.workAvailability.map((availability, i) => (
                        <li key={i}>{availability}</li>
                    ))}
                </ul>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Type of support</Typography>
                <ul>
                    {profileUser.work.supportType.map((support, i) => (
                        <li key={i}>{support}</li>
                    ))}
                </ul>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Work type</Typography>
                <ul>
                    {profileUser.work.workType.map((type, i) => (
                        <li key={i}>{type}</li>
                    ))}
                </ul>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Gender preference</Typography>
                <Typography variant='body2' align='justify'>{profileUser.work.genderPreference}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Age preference</Typography>
                <ul>
                    {profileUser.work.agePreference.map((age, i) => (
                        <li key={i}>{age}</li>
                    ))}
                </ul>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Hold unrestricted licence</Typography>
                <Typography variant='body2' align='justify'>{profileUser.work.drivingLicence}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Willing to drive own car</Typography>
                <Typography variant='body2' align='justify'>{profileUser.work.drivingOwnCar}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Willing to drive your client's car</Typography>
                <Typography variant='body2' align='justify'>{profileUser.work.drivingClientCar}</Typography>
            </div>
        </Paper>
         <Paper className={classes.checkPaper}>

         </Paper>
         </>
    )
}

const ClientProfile = ({ profileUser }) => {
    const theme = useTheme()

    const useStyles = makeStyles(() => ({
        disabilityPaper: {
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },
        sectionPadding: {
            padding: theme.spacing(2) 
        },
        elementMargin: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1)
        }

    }))

    const classes = useStyles()

    return (
        <Paper className={classes.disabilityPaper}>
            <Typography variant='subtitle1' color='primary'>Disability</Typography>
            <div className={classes.sectionPadding}>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Type of disabilityPaper</Typography>
                <Typography variant='body2' align='justify'>{profileUser.disabilityInfo.disability}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Type of support</Typography>
                <ul>
                    {profileUser.disabilityInfo.supportType.map((support, i) => (
                        <li key={i}>{support}</li>
                    ))}
                </ul>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Average support time per week</Typography>
                <Typography variant='body2' align='justify'>{profileUser.disabilityInfo.supportTime}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Support worker gender preference</Typography>
                <Typography variant='body2' align='justify'>{profileUser.disabilityInfo.genderPreference}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Positive behaviour support</Typography>
                <Typography variant='body2' align='justify'>{profileUser.disabilityInfo.behaviourSupport}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Support worker to use restrictive practices</Typography>
                <Typography variant='body2' align='justify'>{profileUser.disabilityInfo.restrictivePractices}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Prescribed medication</Typography>
                <Typography variant='body2' align='justify'>{profileUser.disabilityInfo.medication}</Typography>
                <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Support worker to administer medication</Typography>
                <Typography variant='body2' align='justify'>{profileUser.disabilityInfo.administerMedication}</Typography>
            </div>
        </Paper>
    )
}

export default function Profile({ history, match }) {

    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [profileUser, setProfileUser] = useState('')

    const theme = useTheme()
    
    const { user } = useContext(UserContext)

    useEffect(() => {
        console.log(match.params.id)
        try{
            firebaseGetUserInfo(match.params.id)
            .then((userInfo) => {
                console.log(userInfo)
                setProfileUser(userInfo)
            })
            .catch((error) => {
                setMessage(strings.profile_fetch_user_error)
                setOpenError(true)
            })
        } catch (error) {
            setMessage(strings.profile_fetch_user_error)
            setOpenError(true)
        }
        
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
        sectionPadding: {
            padding: theme.spacing(2) 
        },
        elementMargin: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1)
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
        console.log('handleHire')
    }

   
    if (!user) {
        return <Redirect to={strings.signin_url} />
    } else {
        if (!user.complete) {
            return <Registration history={history}/>
        } else {
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
                                {
                                     profileUser.type === 'worker' && user.email !== profileUser.email
                                    ? <HireWorker handleHire={handleHire}/>
                                    : null
                                }
                                
                            </Paper>
                            <Paper className={classes.aboutPaper}> 
                                <Typography variant='subtitle1' color='primary'>About</Typography>
                                <div className={classes.sectionPadding}>
                                    <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Biograpghy</Typography>
                                    <Typography variant='body2' align='justify'>{profileUser.biograpghy}</Typography>
                                    <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Place of birth</Typography>
                                    <Typography variant='body2' >{profileUser.birthCountry}</Typography>
                                    <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Gender</Typography>
                                    <Typography variant='body2'>{profileUser.gender}</Typography>
                                    <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Languages</Typography>
                                    <ul>
                                        {profileUser.languages.map((language, i) => (
                                            <li key={i}>{language}</li>
                                        ))}
                                    </ul>
                                    <Typography variant='subtitle2' color='primary' className={classes.elementMargin}>Interests and hobbies</Typography>
                                    <ul>
                                        {['Soccer', 'Surfing', 'Chess', 'Watching movies'].map((language, i) => (
                                            <li key={i}>{language}</li>
                                        ))}
                                    </ul>
                                </div>
                            </Paper>
                            {
                                profileUser.type === 'client'
                                ? <ClientProfile profileUser={profileUser}/>
                                : <WorkerProfile profileUser={profileUser}/>
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
                        </>

                        : <CircularProgress color="secondary" />
                    }
                   
                </div>
            )
        }
    }
}