import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import {
  Typography, Paper, Avatar, CircularProgress, Link,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating';
import 'date-fns';
import Registration from '../Registration'
import { firebaseGetAllUsers } from '../../api/Firebase'
import { useUser } from '../../context/UserContext'
import { keyIdGenerator } from '../../api/RandomId'
import { useAlert } from '../../context/AlertContext'

const UserCard = ({ profile, history }) => {
  const theme = useTheme()

  const useStyles = makeStyles(() => ({
    profileCardPaper: {
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
      margin: theme.spacing(2),
    },
  }))

  const classes = useStyles()

  return (
    <Paper className={classes.profileCardPaper}>
      <div className={classes.profileCardHeader}>
        <Avatar alt="profile avatar" src={profile.data.avatar} className={classes.avatar} />
        <div className={classes.margin}>
          <Typography variant="subtitle1" color="primary">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link onClick={() => history.replace(`/profile/${profile.id}`)}>
              {profile.data.firstName}
              {' '}
              {profile.data.lastName}
            </Link>
          </Typography>
          <Rating name="read-only" size="small" value={3} readOnly />
        </div>
      </div>
      <Typography variant="caption" align="justify">{profile.data.biograpghy.split('').slice(0, 200).concat([' ...']).join('')}</Typography>
    </Paper>
  )
}

const UsersList = ({ profiles, history }) => (
  <>
    {profiles.map((profile) => (
      <UserCard key={keyIdGenerator()} profile={profile} history={history} />
    ))}
  </>
)

export default function Search({ history }) {
  const [profiles, setProfiles] = useState([])

  const { user } = useUser()
  const { showErrorAlert } = useAlert()
  const theme = useTheme()

  useEffect(() => {
    try {
      firebaseGetAllUsers(user.type)
        .then((users) => setProfiles(users.filter((userFiltered) => userFiltered.data.complete === true)))
        .catch((error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Error retrieving users. Please contact Kindle supoprt')
          }
        })
    } catch (error) {
      if (error.message) {
        showErrorAlert(error.message)
      } else {
        showErrorAlert('Error retrieving users. Please contact Kindle supoprt')
      }
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
      padding: theme.spacing(2),
    },
    margin: {
      margin: theme.spacing(1),
    },
  }))

  const classes = useStyles()

  if (!user) {
    return <Redirect to="/signin" />
  }

  if (!user.complete) {
    return <Registration history={history} />
  }

  return (
    <div className={classes.root}>
      { profiles.length > 0
        ? <UsersList profiles={profiles} history={history} />
        : <CircularProgress color="secondary" />}
    </div>
  )
}
