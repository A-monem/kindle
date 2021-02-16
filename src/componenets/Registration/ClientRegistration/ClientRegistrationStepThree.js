import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, Box,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddUserInfo } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'
import { strings } from '../../../constants';

function ClientRegistrationStepThree({ activeStep, setActiveStep }) {
  const [refereeFirstName, setRefereeFirstName] = useState('')
  const [refereeLastName, setRefereeLastName] = useState('')
  const [refereeEmail, setRefereeEmail] = useState('')
  const [refereePhoneNumber, setRefereePhoneNumber] = useState('')
  const [refereeRelationship, setRefereeRelationship] = useState('')

  const { user, addUser } = useUser()
  const theme = useTheme()
  const { showErrorAlert } = useAlert()

  useEffect(() => {
    document.getElementById('kindleApp').scrollIntoView();

    if (user.referee) {
      setRefereeFirstName(user.referee.firstName)
      setRefereeLastName(user.referee.lastName)
      setRefereeEmail(user.referee.email)
      setRefereePhoneNumber(user.referee.phoneNumber)
      setRefereeRelationship(user.referee.relationship)
    }
  }, [])

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexGrow: 1,
      width: '100%',
      marginTop: theme.spacing(3),
      [theme.breakpoints.down('lg')]: {
        marginTop: theme.spacing(0),
      },
    },
    fullWidthOnMedium: {
      width: '50%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    marginTop: {
      marginTop: theme.spacing(2),
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    buttons: {
      width: '100%',
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'center',
    },
  }))
  const classes = useStyles()

  const handleNext = (e) => {
    e.preventDefault()

    const refereeInfo = {
      firstName: refereeFirstName,
      lastName: refereeLastName,
      email: refereeEmail,
      phoneNumber: refereePhoneNumber,
      relationship: refereeRelationship,
    }

    firebaseAddUserInfo('referee', refereeInfo)
      .then((userInfo) => {
        addUser(userInfo)
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      })
      .catch((error) => {
        if (error.message) {
          showErrorAlert(error.message)
        } else {
          showErrorAlert('Failed to add inforamtion. Please contact Kindle support')
        }
      })
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={(e) => handleNext(e)}>
        <Typography variant="subtitle1" className={classes.marginTop} color="primary">Referee</Typography>
        <Box mt={2} className={classes.fullWidthOnMedium}>
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="refereeFirstName"
            label="First Name"
            name="refereeFirstName"
            value={refereeFirstName}
            onChange={(e) => setRefereeFirstName(e.target.value)}
          />
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="refereeLastName"
            label="Last Name"
            name="refereeLastName"
            value={refereeLastName}
            onChange={(e) => setRefereeLastName(e.target.value)}
          />
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="refereeEmail"
            label="Email Address"
            name="refereeEmail"
            value={refereeEmail}
            onChange={(e) => setRefereeEmail(e.target.value)}
          />
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="refereePhoneNumber"
            label="Phone Number"
            name="refereePhoneNumber"
            type="tel"
            placeholder="0444888999"
            value={refereePhoneNumber}
            onChange={(e) => setRefereePhoneNumber(e.target.value)}
          />
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="refereeRelationship"
            label="Relationship"
            name="refereeRelationship"
            value={refereeRelationship}
            onChange={(e) => setRefereeRelationship(e.target.value)}
          />
        </Box>
        <Box mt={2}>
          <Typography variant="caption" className={classes.marginTop}>{strings.client_referee}</Typography>
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}

ClientRegistrationStepThree.propTypes = {
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
}

export default ClientRegistrationStepThree
