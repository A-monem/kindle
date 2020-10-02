import React, { useState } from 'react';
import { Typography, Stepper, Step, StepLabel, Button, Paper, FormControl, RadioGroup, Radio, FormControlLabel } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import ClientRegistrationStepOne from './ClientRegistrationStepOne'
import ClientRegistrationStepTwo from './ClientRegistrationStepTwo'
import { Height } from '@material-ui/icons';

export default function Registration({ history }) {
    const [activeStep, setActiveStep] = React.useState(0);

    const theme = useTheme()

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
        }
    }))

    const classes = useStyles()

    const getSteps = () => {
        return ['Personal Information', 'Information about your disability', 'Upload required documents'];
    }

    const steps = getSteps();

    const handleReset = () => {
        setActiveStep(0);
    };

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return <ClientRegistrationStepOne activeStep={activeStep} setActiveStep={setActiveStep}/>
            case 1:
                return <ClientRegistrationStepTwo />
            case 2:
                return 'This is the bit I really care about!';
            default:
                return 'Unknown stepIndex';
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
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>All steps completed</Typography>
                            <Button onClick={handleReset}>Reset</Button>
                        </div>
                    ) : (
                            <>
                                {getStepContent(activeStep)}
                            </>
                        )}
                </div>
            </Paper>
        </div>
    );
}