import React, {useContext} from 'react';
import { UserContext } from '../context/UserContext'
import { Typography, Stepper, Step, StepLabel, Button, Paper } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ClientRegistrationStepOne from './ClientRegistration/ClientRegistrationStepOne'
import ClientRegistrationStepTwo from './ClientRegistration/ClientRegistrationStepTwo'
import ClientRegistrationStepThree from './ClientRegistration/ClientRegistrationStepThree'
import ClientRegistrationStepFour from './ClientRegistration/ClientRegistrationStepFour'
import ClientRegistrationStepFive from './ClientRegistration/ClientRegistrationStepFive'
import WorkerRegistrationStepOne from './WorkerRegistration/WorkerRegistrationStepOne'
import WorkerRegistrationStepTwo from './WorkerRegistration/WorkerRegistrationStepTwo'
import WorkerRegistrationStepThree from './WorkerRegistration/WorkerRegistrationStepThree'
import WorkerRegistrationStepFour from './WorkerRegistration/WorkerRegistrationStepFour'
import WorkerRegistrationStepFive from './WorkerRegistration/WorkerRegistrationStepFive'
import WorkerRegistrationStepSix from './WorkerRegistration/WorkerRegistrationStepSix'

export default function Registration({ history }) {
    const [activeStep, setActiveStep] = React.useState(3);

    const theme = useTheme()
    const { user } = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexGrow: 1,
            width: '100%',
            height: '100%'
        },
        margin: {
            margin: theme.spacing(1)
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: theme.spacing(10),
            padding: theme.spacing(5),
            width: '80%',
            Height: '100%'
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        body: {
            width: '100%',
            Height: '100%',
            marginTop: theme.spacing(2)
        },
        stepsCompleted: {

        }
    }))

    const classes = useStyles()

    const getSteps = () => {
        return(
            user.type === 'client' 
            ? ['Personal Information', 'Disability information', 'Referee', 'Financial Information', 'Agreement']
            : ['Personal Information', 'Support work', 'Qualification', 'Referee', 'Financial Information', 'Agreement']
        )
    }

    const steps = getSteps();

    const handleReset = () => {
        setActiveStep(0);
    };

    const getStepContent = (stepIndex) => {
        if (user.type === 'client'){
            switch (stepIndex) {
                case 0:
                    return <ClientRegistrationStepOne activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 1:
                    return <ClientRegistrationStepTwo activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 2:
                    return <ClientRegistrationStepThree activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 3:
                    return <ClientRegistrationStepFour activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 4:
                    return <ClientRegistrationStepFive activeStep={activeStep} setActiveStep={setActiveStep} history={history}/>
                default:
                    return 'Unknown stepIndex';
            }
        } else {
            switch (stepIndex) {
                case 0:
                    return <WorkerRegistrationStepOne activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 1:
                    return <WorkerRegistrationStepTwo activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 2:
                    return <WorkerRegistrationStepThree activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 3:
                    return <WorkerRegistrationStepFour activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 4:
                    return <WorkerRegistrationStepFive activeStep={activeStep} setActiveStep={setActiveStep}/>
                case 5:
                    return <WorkerRegistrationStepSix activeStep={activeStep} setActiveStep={setActiveStep} history={history}/>
                default:
                    return 'Unknown stepIndex';
            }
        }
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Stepper style={{ width: '100%', padding: 0, margin: 0 }} activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className={classes.body}>
                    {getStepContent(activeStep)}
                </div>
            </Paper>
        </div>
    );
}