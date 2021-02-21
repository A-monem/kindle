import React, { useState, useEffect } from 'react'
import {
  Button, Typography, Paper, IconButton, Avatar, CircularProgress, Tooltip, useMediaQuery,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import 'date-fns'
import moment from 'moment'
import { Redirect } from 'react-router-dom'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import GroupIcon from '@material-ui/icons/Group'
import Registration from '../Registration'
import { firebaseGetUserInfo } from '../../api/Firebase'
import { strings } from '../../constants'
import { useUser } from '../../context/UserContext'
import { useAlert } from '../../context/AlertContext'
import { keyIdGenerator } from '../../api/RandomId'
import WorkerProfile from './WorkerProfile'
import ClientProfile from './ClientProfile'

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

  return (
    <div className={classes.personalButtons}>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={handleHire}
      >
        Hire
      </Button>
    </div>
  )
}

export default function Profile({ history, match }) {
  const [profileUser, setProfileUser] = useState('')

  const { user } = useUser()
  const theme = useTheme()
  const { showErrorAlert } = useAlert()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    try {
      firebaseGetUserInfo(match.params.id)
        .then((userInfo) => {
          setProfileUser(userInfo)
        })
        .catch((error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert(strings.profile_fetch_user_error)
          }
        })
    } catch (error) {
      if (error.message) {
        showErrorAlert(error.message)
      } else {
        showErrorAlert(strings.profile_fetch_user_error)
      }
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
      padding: theme.spacing(2),
    },
    sectionPadding: {
      padding: theme.spacing(2),
    },
    elementMargin: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
    personalPaper: {
      width: '80%',
      display: 'flex',
      flexDirection: matches ? 'column' : 'row',
      justifyContent: matches ? 'center' : 'flex-start',
      alignItems: 'center',
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
    },
    avatar: {
      width: theme.spacing(20),
      height: theme.spacing(20),
      marginRight: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(10),
        height: theme.spacing(10),
        marginBottom: theme.spacing(2),
      },
    },
    personalInfo: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: matches ? 'center' : 'flex-start',
      height: '80%',
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
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
    },
  }))
  const classes = useStyles()

  const handleHire = () => {
    console.log('handleHire')
  }

  if (!user) {
    return <Redirect to={strings.signin_url} />
  }

  if (!user.complete) {
    return <Registration history={history} />
  }

  return (
    <div className={classes.root}>
      {profileUser
        ? (
          <>
            <Paper className={classes.personalPaper}>
              <Avatar alt="profile avatar" src={profileUser.avatar} className={classes.avatar} />
              <div className={classes.personalInfo}>
                <Typography variant="subtitle1" color="primary">
                  {profileUser.firstName}
                  {' '}
                  {profileUser.lastName}
                </Typography>
                <div className={classes.personalIcon}>
                  <Tooltip title="Location">
                    <LocationOnIcon fontSize="small" color="secondary" style={{ marginRight: theme.spacing(2) }} />
                  </Tooltip>
                  <Typography variant="caption" color="primary">
                    {profileUser.address.suburb.charAt(0) + profileUser.address.suburb.slice(1).toLowerCase()}
                    ,
                    {' '}
                    {profileUser.address.stateAus}
                  </Typography>
                </div>
                <div className={classes.personalIcon}>
                  <Tooltip title="Membership date">
                    <IconButton>
                      <GroupIcon fontSize="small" color="secondary" />
                    </IconButton>
                  </Tooltip>
                  <Typography variant="caption" color="primary">{moment(new Date(profileUser.membership)).format('DD/MM/YYYY')}</Typography>
                </div>
              </div>
              {profileUser.type === 'worker' && user.email !== profileUser.email && <HireWorker handleHire={handleHire} />}
            </Paper>
            <Paper className={classes.aboutPaper}>
              <Typography variant="subtitle1" color="primary">About</Typography>
              <div className={classes.sectionPadding}>
                <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Biograpghy</Typography>
                <Typography variant="body2" align="justify">{profileUser.biograpghy}</Typography>
                <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Place of birth</Typography>
                <Typography variant="body2">{profileUser.birthCountry}</Typography>
                <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Gender</Typography>
                <Typography variant="body2">{profileUser.gender}</Typography>
                <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Languages</Typography>
                <ul>
                  {profileUser.languages.map((language) => (
                    <li key={keyIdGenerator()}>{language}</li>
                  ))}
                </ul>
                <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Interests and hobbies</Typography>
                <ul>
                  {['Soccer', 'Surfing', 'Chess', 'Watching movies'].map((language) => (
                    <li key={keyIdGenerator()}>{language}</li>
                  ))}
                </ul>
              </div>
            </Paper>
            {
                profileUser.type === 'client'
                  ? <ClientProfile profileUser={profileUser} />
                  : <WorkerProfile profileUser={profileUser} />
            }
          </>
        )
        : <CircularProgress color="secondary" />}
    </div>
  )
}
