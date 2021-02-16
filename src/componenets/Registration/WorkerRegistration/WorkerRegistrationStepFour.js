import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, MenuItem, Box, Collapse,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { firebaseAddUserInfo } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'
import { arrays } from '../../../constants'
import { keyIdGenerator } from '../../../api/RandomId'

function RefereeTemplate({
  referee, setReferee, relationshipOptions, relationshipLengthOptions,
}) {
  return (
    <Box mt={2}>
      <TextField
        size="small"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="First Name"
        name="refereeFirstName"
        value={referee.firstName}
        onChange={(e) => setReferee({ ...referee, firstName: e.target.value })}
      />
      <TextField
        size="small"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Last Name"
        name="refereeLastName"
        value={referee.lastName}
        onChange={(e) => setReferee({ ...referee, lastName: e.target.value })}
      />
      <TextField
        size="small"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        type="email"
        label="Email Address"
        name="refereeEmail"
        value={referee.email}
        onChange={(e) => setReferee({ ...referee, email: e.target.value })}
      />
      <TextField
        size="small"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Phone Number"
        name="refereePhoneNumber"
        type="tel"
        placeholder="0444888999"
        value={referee.phoneNumber}
        onChange={(e) => setReferee({ ...referee, phoneNumber: e.target.value })}
      />
      <TextField
        size="small"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Relationship"
        name="refereeRelationship"
        select
        value={referee.relationship}
        onChange={(e) => setReferee({ ...referee, relationship: e.target.value })}
      >
        {relationshipOptions.map((option) => (
          <MenuItem key={keyIdGenerator()} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      {referee.relationshipDescription !== 'undefined' && (
        <Collapse in={referee.relationship === 'Other'}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Relationship description"
            name="referee RelationshipDescription"
            multiline
            rows={7}
            value={referee.relationshipDescription}
            onChange={(e) => setReferee({ ...referee, relationshipDescription: e.target.value })}
          />
        </Collapse>
      )}
      <TextField
        size="small"
        variant="outlined"
        margin="normal"
        required
        fullWidth
        label="Lenght of relationship"
        name="refereeRelationshipLength"
        select
        value={referee.relationshipLength}
        onChange={(e) => setReferee({ ...referee, relationshipLength: e.target.value })}
      >
        {relationshipLengthOptions.map((option) => (
          <MenuItem key={keyIdGenerator()} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}

function WorkerRegistrationStepFour({ activeStep, setActiveStep }) {
  const [one, setOne] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    relationship: '',
    relationshipLength: '',
  })
  const [two, setTwo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    relationship: '',
    relationshipDescription: '',
    relationshipLength: '',
  })

  const { user, addUser } = useUser()
  const theme = useTheme()
  const { showErrorAlert } = useAlert()

  useEffect(() => {
    document.getElementById('kindleApp').scrollIntoView();

    if (user.referee) {
      setOne(user.referee.one)
      setTwo(user.referee.two)
    }
  }, [])

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      height: '100%',
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
    padding: {
      padding: theme.spacing(2),
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

    console.log({ one })
    console.log({ two })

    const referees = {
      one,
      two,
    }

    firebaseAddUserInfo('referee', referees)
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
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={(e) => handleNext(e)}>
        <Typography variant="subtitle1" color="primary">Referee 1</Typography>
        <div className={classes.fullWidthOnMedium}>
          <RefereeTemplate
            referee={one}
            setReferee={setOne}
            relationshipOptions={arrays.refereeRelationshipOptions}
            relationshipLengthOptions={arrays.refereeRelationshipLengthOptions}
            rend={false}
          />
        </div>
        <Typography variant="subtitle1" color="primary">Referee 2</Typography>
        <div className={classes.fullWidthOnMedium}>
          <RefereeTemplate
            referee={two}
            setReferee={setTwo}
            relationshipOptions={arrays.refereeRelationshipOptions.concat(arrays.refereeExtraRelationshipOptions)}
            relationshipLengthOptions={arrays.refereeRelationshipLengthOptions}
            rend
          />
        </div>
        <div>
          <Typography variant="caption">We will contact two referees and send them a quick survey to learn more about you. This should include at least one professional reference from within the last two years.</Typography>
        </div>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}

WorkerRegistrationStepFour.propTypes = {
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
}

export default WorkerRegistrationStepFour
