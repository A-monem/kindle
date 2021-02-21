import React from 'react'
import { Typography, Paper } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import 'date-fns'
import PropTypes from 'prop-types'
import { keyIdGenerator } from '../../../api/RandomId'

function ClientProfile({ profileUser }) {
  const theme = useTheme()
  const useStyles = makeStyles(() => ({
    disabilityPaper: {
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
    <Paper className={classes.disabilityPaper}>
      <Typography variant="subtitle1" color="primary">Disability</Typography>
      <div className={classes.sectionPadding}>
        <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Type of disabilityPaper</Typography>
        <Typography variant="body2" align="justify">{profileUser.disabilityInfo.disability}</Typography>
        <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Type of support</Typography>
        <ul>
          {profileUser.disabilityInfo.supportType.map((support) => (
            <li key={keyIdGenerator()}>{support}</li>
          ))}
        </ul>
        <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Average support time per week</Typography>
        <Typography variant="body2" align="justify">{profileUser.disabilityInfo.supportTime}</Typography>
        <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Support worker gender preference</Typography>
        <Typography variant="body2" align="justify">{profileUser.disabilityInfo.genderPreference}</Typography>
        <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Positive behaviour support</Typography>
        <Typography variant="body2" align="justify">{profileUser.disabilityInfo.behaviourSupport}</Typography>
        <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Support worker to use restrictive practices</Typography>
        <Typography variant="body2" align="justify">{profileUser.disabilityInfo.restrictivePractices}</Typography>
        <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Prescribed medication</Typography>
        <Typography variant="body2" align="justify">{profileUser.disabilityInfo.medication}</Typography>
        <Typography variant="subtitle2" color="primary" className={classes.elementMargin}>Support worker to administer medication</Typography>
        <Typography variant="body2" align="justify">{profileUser.disabilityInfo.administerMedication}</Typography>
      </div>
    </Paper>
  )
}

ClientProfile.propTypes = {
  profileUser: PropTypes.object.isRequired,
}

export default ClientProfile
