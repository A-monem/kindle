import React, { useState } from 'react';
import { Typography, Stepper, Step, StepLabel, Button, Paper, FormControl, RadioGroup, Radio, FormControlLabel } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'

export default function Signup({ history }) {
    const [activeStep, setActiveStep] = React.useState(0);

    const theme = useTheme()

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing(1)
        },
        margin: {
            margin: theme.spacing(1)
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
        buttons: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: theme.spacing(2)
        },
    }))

    const classes = useStyles()

    const getSteps = () => {
        return ['Who is this account for?', 'Create an ad group', 'Create an ad'];
    }

    const steps = getSteps();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const getStepContent = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return ( <FormControl component="fieldset">
                <RadioGroup aria-label="gender" name="gender1" >
                    <FormControlLabel value="Myself" control={<Radio />} label="Myself" />
                    <FormControlLabel value="Family" control={<Radio />} label="Family" />
                    <FormControlLabel value="My Client" control={<Radio />} label="My Client" />
                </RadioGroup>
              </FormControl>)
            case 1:
                return 'What is an ad group anyways?';
            case 2:
                return 'This is the bit I really care about!';
            default:
                return 'Unknown stepIndex';
        }
    }

    return (
        <div className={classes.root}>
            <Paper><Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div>
                {activeStep === steps.length ? (
                    <div>
                        <Typography className={classes.instructions}>All steps completed</Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </div>
                ) : (
                        <div>
                            {getStepContent(activeStep)}
                            <div>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    className={classes.backButton}
                                >
                                    Back
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleNext} variant="outlined" size="small">
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
            </div></Paper>
            
        </div>
    );
}