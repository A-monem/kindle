import React, { useState, useEffect } from 'react';
import { Typography, Button, RadioGroup, Radio, FormControlLabel, FormGroup, TextField, MenuItem, Snackbar, Checkbox, Tooltip } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddFinancialInfo } from '../../api/Firebase'

export default function ClientRegistrationStepFour({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [ndiaFunding, setNdisFunding] = useState('')
    const [fundingType, setFundingType] = useState('')

    useEffect(() => {

    }, [])

    const theme = useTheme()

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexGrow: 1,
            width: '100%',
            marginTop: theme.spacing(2)
        },
        margin: {
            marginTop: theme.spacing(2)
        },
        backButton: {
            marginRight: theme.spacing(1),
        },
        buttons: {
            width: '100%', 
            marginTop: theme.spacing(4), 
            display: 'flex', 
            justifyContent: 'center'
        },
        funding:{
            marginTop: theme.spacing(2),
            width: '50%'
        }, 
        fundingType: {
            marginTop: theme.spacing(2),
            width: '50%'
        }
    }))

    const classes = useStyles()

    const handleErrorClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
        setMessage('')
    }

    const handleSuccessClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
        setMessage('')
    }

    const handleNext = () => {
        
        const check = checkFields()
        const financialInfo = {
            ndiaFunding,
            fundingType
        }

        if (true){
            firebaseAddFinancialInfo(financialInfo)
                .then(() => setActiveStep((prevActiveStep) => prevActiveStep + 1))
                .catch((error) => {
                    setMessage(error)
                    setOpenError(true)
                })
        } 
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    };

    const checkFields = () => {
        if (ndiaFunding) {
            if (fundingType) {
                return true
            } else {
                setMessage('Please make sure you have selected funding type')
                setOpenError(true)
                return false
            }
        } else {
            setMessage('Please make sure you have selected whether you are using NDIA funding')
            setOpenError(true)
            return false
        }
    }

    return (
        <div className={classes.root}>
            <div>
                <Typography variant='subtitle2'>We collect financial information so we can arrange payroll and invoicing services. As with everything you tell us, it's important to know that this information will not be shared with anyone.</Typography>
            </div>
            <div className={classes.funding}>
                <Typography variant='subtitle1' color='primary'>1) Will you be using NDIA funding ?</Typography>
                <RadioGroup onChange={(e) => setNdisFunding(e.target.value)}>
                    <FormControlLabel value='Yes' control={<Radio color='primary' />} label='Yes' />
                    <FormControlLabel value='No' control={<Radio color='primary' />} label='No' />
                </RadioGroup>
            </div>
            
            <div className={classes.fundingType}>
                <Typography variant='subtitle2' color='primary'>2) What is your payment method ?</Typography>
                { ndiaFunding === 'Yes' 
                ? 
                <RadioGroup onChange={(e) => setFundingType(e.target.value)}>
                    <FormControlLabel value='self-managed' control={<Radio color='primary' />} label='Self Managed' />
                    <FormControlLabel value='plan-managed' control={<Radio color='primary' />} label='Plan Managed' />
                    <FormControlLabel value='agency-managed' control={<Radio color='primary' />} label='NDIA/Agency Managed' />
                </RadioGroup>
                :
                <RadioGroup onChange={(e) => setFundingType(e.target.value)}>
                    <FormControlLabel value='self-managed' control={<Radio color='primary' />} label='Self Managed' />
                    <FormControlLabel value='plan-managed' control={<Radio color='primary' />} label='Plan Managed' />
                </RadioGroup>
                }
            </div>
            <div className={classes.buttons}>
                <Button
                    variant='contained'
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                >
                    Back
                </Button>
                <Button variant='contained' color='primary' onClick={handleNext}>
                    Next
                </Button>
            </div>
            <>
                <Snackbar open={openError} autoHideDuration={6000} onClose={handleErrorClose}>
                        <Alert onClose={handleErrorClose} severity='error'>
                            {message}
                        </Alert>
                    </Snackbar>
                <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleSuccessClose}>
                    <Alert onClose={handleSuccessClose} severity='success'>
                        {message}
                    </Alert>
                </Snackbar>
            </>
        </div>
    );
}