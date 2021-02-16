import React, { useState, useEffect } from 'react';
import {
  Typography, FormControlLabel, Checkbox, Link, Box,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseGetServiceAgreementUrl, firebaseSetRegistrationComplete } from '../../../api/Firebase'
import { useAlert } from '../../../context/AlertContext'
import { useUser } from '../../../context/UserContext'
import NextBackButtons from '../NextBackButtons'
import { strings, arrays } from '../../../constants'

export default function ClientRegistrationStepFive({ activeStep, setActiveStep, history }) {
  const [infoConfirmation, setInfoConfirmation] = useState(false)
  const [serviceAgreement, setServiceAgreement] = useState(false)
  const [serviceAgreementUrl, setServiceAgreementUrl] = useState('')
  const [termsAndPrivacy, setTermsAndPrivacy] = useState(false)

  const { user, addUser } = useUser()
  const theme = useTheme()
  const { showErrorAlert } = useAlert()

  useEffect(() => {
    firebaseGetServiceAgreementUrl('Kindle_Cient_Service_Agreement')
      .then((url) => setServiceAgreementUrl(url))
      .catch((error) => {
        if (error.message) {
          showErrorAlert(error.message)
        } else {
          showErrorAlert('Failed to get service agreement document. Please contact Kindle support')
        }
      })
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
    padding: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
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

    firebaseSetRegistrationComplete()
      .then((userInfo) => {
        addUser(userInfo)
      })
      .then(() => history.replace('./dashboard'))
      .catch((error) => {
        if (error.message) {
          showErrorAlert(error.message)
        } else {
          showErrorAlert('Failed to complete registration. Please contact Kindle support')
        }
      })
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="h6">Confirming the information you have given us</Typography>
          <FormControlLabel
            className={classes.padding}
            control={(
              <Checkbox
                onChange={(e) => setInfoConfirmation(e.target.checked)}
                color="primary"
                name="correctInfo"
                required
              />
            )}
            label={strings.truthful_info_disclaimer}
          />
        </Box>
        <div>
          <Typography variant="h6">Our service agreement</Typography>
          <Typography variant="subtitle2" className={classes.margin}>
            Please read carefully our&nbsp;
            <Link
              target="_blank"
              href={serviceAgreementUrl}
            >
              service agreement
            </Link>
          </Typography>
          <FormControlLabel
            className={classes.padding}
            control={(
              <Checkbox
                onChange={(e) => setServiceAgreement(e.target.checked)}
                color="primary"
                name="correctInfo"
                required
              />
            )}
            label={`I, ${user.firstName} ${user.lastName}, ${strings.service_agreement_disclaimer}`}
          />
        </div>
        <div>
          <Typography variant="h6">Our Terms of Use and Privacy Policy</Typography>
          <Typography variant="subtitle2" className={classes.margin}>
            Please read carefully our&nbsp;
            <Link
              target="_blank"
              href="/terms"
            >
              terms of use
            </Link>
              &nbsp;and&nbsp;
            <Link
              target="_blank"
              href="/privacy"
            >
              Privacy Policy
            </Link>
          </Typography>
          <FormControlLabel
            className={classes.padding}
            control={(
              <Checkbox
                onChange={(e) => setTermsAndPrivacy(e.target.checked)}
                color="primary"
                name="correctInfo"
                required
              />
            )}
            label={strings.age_disclaimer}
          />
        </div>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}
