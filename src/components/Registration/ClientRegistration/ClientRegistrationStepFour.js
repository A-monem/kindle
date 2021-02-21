import React, { useState, useEffect } from 'react';
import {
  Typography, RadioGroup, Radio, FormControlLabel, Box, Collapse,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddUserInfo } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'
import { strings } from '../../../constants';

function ClientRegistrationStepFour({ activeStep, setActiveStep }) {
  const [ndiaFunding, setNdiaFunding] = useState('')
  const [fundingType, setFundingType] = useState('')

  const { user, addUser } = useUser()
  const theme = useTheme()
  const { showErrorAlert } = useAlert()

  useEffect(() => {
    document.getElementById('kindleApp').scrollIntoView();

    if (user.financialInfo) {
      setNdiaFunding(user.financialInfo.ndiaFunding)
      setFundingType(user.financialInfo.fundingType)
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
    margin: {
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

    const financialInfo = {
      ndiaFunding,
      fundingType,
    }

    firebaseAddUserInfo('financialInfo', financialInfo)
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
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  };

  return (
    <div className={classes.root}>
      <form onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">1) Will you be using NDIA funding ?</Typography>
          <RadioGroup onChange={(e) => setNdiaFunding(e.target.value)} value={ndiaFunding}>
            <FormControlLabel value="Yes" control={<Radio color="primary" required />} label="Yes" />
            <FormControlLabel value="No" control={<Radio color="primary" required />} label="No" />
          </RadioGroup>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">2) What is your payment method ?</Typography>
          <RadioGroup onChange={(e) => setFundingType(e.target.value)} value={fundingType}>
            <FormControlLabel value="self-managed" control={<Radio color="primary" required />} label="Self Managed" />
            <FormControlLabel value="plan-managed" control={<Radio color="primary" required />} label="Plan Managed" />
            <Collapse in={ndiaFunding === 'Yes'}>
              <FormControlLabel value="agency-managed" control={<Radio color="primary" required={ndiaFunding === 'Yes'} />} label="NDIA/Agency Managed" />
            </Collapse>
          </RadioGroup>
        </Box>
        <Box mt={2}>
          <Typography variant="caption">{strings.client_financial}</Typography>
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}

ClientRegistrationStepFour.propTypes = {
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
}

export default ClientRegistrationStepFour
