import React, { useState, useEffect } from 'react';
import {
  Typography, FormControlLabel, Box, Checkbox, Link,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseGetServiceAgreementUrl, firebaseSetRegistrationComplete } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
// import Privacy from '../../Privacy';
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'
import { strings, arrays } from '../../../constants'
import { keyIdGenerator } from '../../../api/RandomId'

export default function WorkerRegistrationStepSeven({ activeStep, setActiveStep, history }) {
  const [transportAgreement, setTransportAgreement] = useState(false)
  const [infoConfirmation, setInfoConfirmation] = useState(false)
  const [serviceAgreement, setServiceAgreement] = useState(false)
  const [serviceAgreementUrl, setServiceAgreementUrl] = useState('')
  const [termsAndPrivacy, setTermsAndPrivacy] = useState(false)

  const { user, addUser } = useUser()
  const theme = useTheme()
  const { showErrorAlert } = useAlert()

  useEffect(() => {
    firebaseGetServiceAgreementUrl('Kindle_Worker_Service_Agreement')
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
    fullWidthOnMedium: {
      width: '50%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
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

    if (transportAgreement && infoConfirmation && serviceAgreement && termsAndPrivacy) {
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
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">Our transportation agreement</Typography>
          <Typography variant="caption" style={{ display: 'block', marginTop: theme.spacing(1) }}>{strings.transportAgreement_disclaimer}</Typography>
          <Typography variant="caption" style={{ display: 'block', marginTop: theme.spacing(1) }}>In signing this you agree to the following:</Typography>
          <ol style={{ lineHeight: theme.spacing(1) / 5, color: theme.palette.secondary, fontSize: '0.75rem' }}>
            {arrays.transportAgreement_terms.map((term) => (
              typeof (term) === 'string' ? (
                <li key={keyIdGenerator()}>{term}</li>
              ) : (
                <li key={keyIdGenerator()}>
                  {term[0]}
                  <ol>
                    {term.filter((subterm, i) => i !== 0).map((subterm) => <li key={keyIdGenerator()}>{subterm}</li>)}
                  </ol>
                </li>
              )
            ))}
          </ol>
          <FormControlLabel
            control={(
              <Checkbox
                onChange={(e) => setTransportAgreement(e.target.checked)}
                color="primary"
                required
              />
            )}
            label="I agree"
          />
        </Box>
        <Box my={2}>
          <Typography variant="subtitle1" color="primary">Confirming the information you have given us</Typography>
          <FormControlLabel
            className={classes.margin}
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
        <Box my={2}>
          <Typography variant="subtitle1" color="primary">Our service agreement</Typography>
          <Typography variant="caption" className={classes.margin}>
            Please read carefully our&nbsp;
            <Link
              target="_blank"
              href={serviceAgreementUrl}
            >
              service agreement
            </Link>
          </Typography>
          <FormControlLabel
            className={classes.margin}
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
        </Box>
        <Box my={2}>
          <Typography variant="subtitle1" color="primary">Our Terms of Use and Privacy Policy</Typography>
          <Typography variant="caption" className={classes.margin}>
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
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}
