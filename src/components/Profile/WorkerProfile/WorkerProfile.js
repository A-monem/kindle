import React from 'react'
import { Typography, Paper } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import 'date-fns'
import PropTypes from 'prop-types'
import { keyIdGenerator } from '../../../api/RandomId'

function WorkerProfile({ profileUser }) {
  const theme = useTheme()
  const useStyles = makeStyles(() => ({
    workerPaper: {
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
    sectionPadding: {
      padding: theme.spacing(2),
    },
    elementMargin: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },

  }))
  const classes = useStyles()

  return (
    <>
      <Paper className={classes.workerPaper}>
        <Typography variant="subtitle1" color="primary">Support work</Typography>
        <div className={classes.sectionPadding}>
          <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Availability</Typography>
          <ul>
            {profileUser.work.workAvailability.map((availability) => (
              <li key={keyIdGenerator()}>{availability}</li>
            ))}
          </ul>
          <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Type of support</Typography>
          <ul>
            {profileUser.work.supportType.map((support) => (
              <li key={keyIdGenerator()}>{support}</li>
            ))}
          </ul>
          <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Work type</Typography>
          <ul>
            {profileUser.work.workType.map((type) => (
              <li key={keyIdGenerator()}>{type}</li>
            ))}
          </ul>
          <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Gender preference</Typography>
          <Typography variant="body2" align="justify">{profileUser.work.genderPreference}</Typography>
          <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Age preference</Typography>
          <ul>
            {profileUser.work.agePreference.map((age) => (
              <li key={keyIdGenerator()}>{age}</li>
            ))}
          </ul>
          <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Hold unrestricted licence</Typography>
          <Typography variant="body2" align="justify">{profileUser.work.drivingLicence}</Typography>
          <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Willing to drive own car</Typography>
          <Typography variant="body2" align="justify">{profileUser.work.drivingOwnCar}</Typography>
          <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Willing to drive your client&apos;s car</Typography>
          <Typography variant="body2" align="justify">{profileUser.work.drivingClientCar}</Typography>
        </div>
      </Paper>
      <Paper className={classes.checkPaper} />
    </>
  )
}

WorkerProfile.propTypes = {
  profileUser: PropTypes.object.isRequired,
}

export default WorkerProfile
