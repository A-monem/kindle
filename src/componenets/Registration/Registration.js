import React from 'react';
import {
  Stepper, Step, StepLabel, Paper, Grid, useMediaQuery,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import {
  ClientRegistrationStepTwo, ClientRegistrationStepThree,
  ClientRegistrationStepFour, ClientRegistrationStepFive,
} from './ClientRegistration'
import {
  WorkerRegistrationStepTwo, WorkerRegistrationStepThree, WorkerRegistrationStepFour,
  WorkerRegistrationStepFive, WorkerRegistrationStepSix, WorkerRegistrationStepSeven,
} from './WorkerRegistration'
import RegistrationStepOne from './RegistrationStepOne'
import { strings, arrays } from '../../constants'

export default function Registration() {
  const [activeStep, setActiveStep] = React.useState(0);
  const history = useHistory()

  const theme = useTheme()
  const { user } = useUser()
  const matches = useMediaQuery(theme.breakpoints.up('lg'));

  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
    },
    margin: {
      margin: theme.spacing(1),
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10),
      padding: theme.spacing(5),
      [theme.breakpoints.down('md')]: {
        marginTop: theme.spacing(0),
        marginBottom: theme.spacing(0),
      },
    },
  }))

  const classes = useStyles()

  const getSteps = () => (
    user.type === strings.client
      ? arrays.client_Registration
      : arrays.worker_Registration
  )

  const steps = getSteps();

  const getStepContent = (stepIndex) => {
    if (user.type === strings.client) {
      switch (stepIndex) {
        case 0:
          return <RegistrationStepOne setActiveStep={setActiveStep} />
        case 1:
          return <ClientRegistrationStepTwo activeStep={activeStep} setActiveStep={setActiveStep} />
        case 2:
          return <ClientRegistrationStepThree activeStep={activeStep} setActiveStep={setActiveStep} />
        case 3:
          return <ClientRegistrationStepFour activeStep={activeStep} setActiveStep={setActiveStep} />
        case 4:
          return <ClientRegistrationStepFive activeStep={activeStep} setActiveStep={setActiveStep} history={history} />
        default:
          return strings.unkown_step
      }
    } else {
      switch (stepIndex) {
        case 0:
          return <RegistrationStepOne setActiveStep={setActiveStep} />
        case 1:
          return <WorkerRegistrationStepTwo activeStep={activeStep} setActiveStep={setActiveStep} />
        case 2:
          return <WorkerRegistrationStepThree activeStep={activeStep} setActiveStep={setActiveStep} />
        case 3:
          return <WorkerRegistrationStepFour activeStep={activeStep} setActiveStep={setActiveStep} />
        case 4:
          return <WorkerRegistrationStepFive activeStep={activeStep} setActiveStep={setActiveStep} />
        case 5:
          return <WorkerRegistrationStepSix activeStep={activeStep} setActiveStep={setActiveStep} />
        case 6:
          return <WorkerRegistrationStepSeven activeStep={activeStep} setActiveStep={setActiveStep} history={history} />
        default:
          return strings.unkown_step
      }
    }
  }

  return (
    <Grid container className={classes.root}>
      <Grid item xs={false} md={2} />
      <Grid item xs={12} md={8}>
        <Paper className={classes.paper}>
          {matches && (
            <Stepper className={classes.stepper} activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          {getStepContent(activeStep)}
        </Paper>
      </Grid>
      <Grid item xs={false} md={2} />
    </Grid>

  );
}
