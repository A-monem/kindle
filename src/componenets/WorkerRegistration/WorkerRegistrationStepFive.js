import React, { useState, useEffect, useContext} from 'react';
import { Typography, Button, RadioGroup, Radio, FormControlLabel, TextField, Snackbar, Checkbox, Tooltip,} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseAddUserInfo } from '../../api/Firebase'
import { UserContext } from '../../context/UserContext'

export default function WorkerRegistrationStepFive({ activeStep, setActiveStep }) {
    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [bankAccountName, setBankAccountName] = useState('')
    const [bankBsb, setBankBsb] = useState('')
    const [bankAccountNumber, setBankAccountNumber] = useState('')
    const [legalName, setLegalName] = useState('')
    const [legalFirstName, setLegalFirstName] = useState('')
    const [legalLastName, setLegalLastName] = useState('')
    const [smsf, setSmsf] = useState('')
    const [fundName, setFundName] = useState('')
    const [fundAbn, setFundAbn] = useState('')
    const [smsfAccountName, setSmsfAccountName] = useState('')
    const [smsfAccountBsb, setSmsfAccountBsb] = useState('')
    const [smsfAccountNumber, setSmsfAccountNumber] = useState('')
    const [smsfElectronicServiceAddress, setSmsfElectronicServiceAddress] = useState('')
    const [superSpinNumber, setSuperSpinNumber] = useState('')
    const [superMemberNumber, setSuperMemberNumber] = useState('')
    const [tfn, setTfn] = useState('')
    const [taxPurposes, setTaxPurposes] = useState('')
    const [previousLastName, setPreviousLastName] = useState('')
    const [taxFreeThreshold, setTaxFreeThreshold] = useState('')
    const [loan, setLoan] = useState('')
    const [debt, setDebt] = useState('')
    const [taxOffset, setTaxOffset] = useState('')
    const [paymentReducation, setPaymentReducation] = useState('')


    useEffect(() => {
        document.getElementById('kindleApp').scrollIntoView();

        if (user.financialInfo){
            setLegalName(user.financialInfo.legalName.legalName)
            setLegalFirstName(user.financialInfo.legalName.legalFirstName)
            setLegalLastName(user.financialInfo.legalName.legalLastName)
            setBankAccountName(user.financialInfo.bank.accountName)
            setBankBsb(user.financialInfo.bank.bsb)
            setBankAccountNumber(user.financialInfo.bank.accountNumber)
            setSmsf(user.financialInfo.supperannuation.smsf)
            setFundName(user.financialInfo.supperannuation.fundName)
            setFundAbn(user.financialInfo.supperannuation.fundAbn)
            setSuperSpinNumber(user.financialInfo.supperannuation.superSpinNumber)
            setSuperMemberNumber(user.financialInfo.supperannuation.superMemberNumber)
            setSmsfAccountName(user.financialInfo.supperannuation.smsfAccountName)
            setSmsfAccountBsb(user.financialInfo.supperannuation.smsfAccountBsb)
            setSmsfAccountNumber(user.financialInfo.supperannuation.smsfAccountNumber)
            setSmsfElectronicServiceAddress(user.financialInfo.supperannuation.smsfElectronicServiceAddress)
            setTfn(user.financialInfo.tax.tfn)
            setTaxPurposes(user.financialInfo.tax.australianResidentForTaxPurposes)
            setPreviousLastName(user.financialInfo.tax.previousLastName)
            setTaxFreeThreshold(user.financialInfo.tax.taxFreeThreshold)
            setLoan(user.financialInfo.tax.loan)
            setDebt(user.financialInfo.tax.financialSupplementDebt)
            setTaxOffset(user.financialInfo.tax.seniorAndPensionerTaxOffset)
            setPaymentReducation(user.financialInfo.tax.paymentReducation)
        } 

    }, [])

    const theme = useTheme()
    const { user, addUser} = useContext(UserContext)

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
        padding: {
            padding: theme.spacing(2)
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
        legalName: {
            marginTop: theme.spacing(2),
            width: '60%'
        },
        bankInfo: {
            marginTop: theme.spacing(2),
            width: '60%'
        }, 
        super: {
            marginTop: theme.spacing(2),
            width: '60%'
        },
        tfn: {
            marginTop: theme.spacing(2),
            width: '60%'
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

    const handleNext = (e) => {
        e.preventDefault()

        const financialInfo = {
            legalName: {
                legalName,
                legalFirstName,
                legalLastName
            },
            bank: {
                accountName: bankAccountName,
                bsb: bankBsb,
                accountNumber: bankAccountNumber,

            },
            supperannuation: {
                smsf,
                fundName,
                fundAbn,
                superSpinNumber,
                superMemberNumber,
                smsfAccountName,
                smsfAccountBsb,
                smsfAccountNumber,
                smsfElectronicServiceAddress
            },
            tax: {
                tfn,
                australianResidentForTaxPurposes: taxPurposes,
                previousLastName,
                taxFreeThreshold,
                loan,
                financialSupplementDebt: debt,
                seniorAndPensionerTaxOffset: taxOffset,
                paymentReducation
            }
        }

        firebaseAddUserInfo('financialInfo', financialInfo)
            .then((user) => {
                addUser(user)
                setActiveStep((prevActiveStep) => prevActiveStep + 1)
            })
            .catch((error) => {
                setMessage(error)
                setOpenError(true)
            })

    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    return (
        <div className={classes.root}>
            <div>
                <Typography variant='caption'>We collect your financial information so we can pay you. As with everything you tell us, it's important to know that this information will not be shared with anyone.</Typography>
            </div>
            <form className={classes.form} onSubmit={e => handleNext(e)}>
                <div className={classes.legalName}>
                    <Typography variant='h6' color={"primary"}>Legal name</Typography>
                    <Typography variant='subtitle1' color='primary' className={classes.margin}>Is your legal name different to the one you used to create your profile ?</Typography>
                    <RadioGroup onChange={(e) => setLegalName(e.target.value)} value={legalName} >
                        <FormControlLabel value='Yes' control={<Radio color='primary' required />} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required />} label='No' />
                    </RadioGroup>
                    {legalName === 'Yes'
                        ?
                        <div style={{paddingTop: theme.spacing(2), paddingLeft: theme.spacing(2)}}>
                            <TextField
                                size='small'
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="legalFirstName"
                                label="Legal first name"
                                name="legalFirstName"
                                value={legalFirstName}
                                onChange={e => setLegalFirstName(e.target.value)}
                            />
                            <TextField
                                size='small'
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="legalLastName"
                                label="Legal last name"
                                name="legalLastName"
                                value={legalLastName}
                                onChange={e => setLegalLastName(e.target.value)}
                            />
                        </div>
                        : null
                    }
                    <Typography variant='caption'>This will only be used on your pay slips and with the ATO and will not appear publicly on your profile.</Typography>
                </div>
                <div className={classes.bankInfo}>
                    <Typography variant='h6' color={"primary"}>Bank account details</Typography>
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="accountName"
                        label="Account name"
                        name="accountName"
                        value={bankAccountName}
                        onChange={e => setBankAccountName(e.target.value)}
                    />
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="bankBsb"
                        label="BSB"
                        name="bankBsb"
                        value={bankBsb}
                        onChange={e => setBankBsb(e.target.value)}
                    />
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="accountNumber"
                        label="Account number"
                        name="accountNumber"
                        value={bankAccountNumber}
                        onChange={e => setBankAccountNumber(e.target.value)}
                    />
                    <Typography variant='caption'>Payroll happens once a fortnight so any shifts you complete in a two week window will be paid all at once at the end of each fortnight.</Typography>
                </div>
                <div className={classes.super}>
                    <Typography variant='h6' color={"primary"}>Supperannuation</Typography>
                    <FormControlLabel
                        control={<Checkbox onChange={() => setSmsf((prevState) => !prevState)} color='primary' name={'smsf'} />}
                        label={"Self-managed fund"}
                        checked={smsf}
                        style={{ marginTop: theme.spacing(1) }}
                    />
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="fundName"
                        label="Fund name"
                        name="fundName"
                        value={fundName}
                        onChange={e => setFundName(e.target.value)}
                    />
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="fundAbn"
                        label="Fund ABN"
                        name="fundAbn"
                        value={fundAbn}
                        onChange={e => setFundAbn(e.target.value)}
                    />
                    {smsf
                        ?
                        <div style={{paddingTop: theme.spacing(2), paddingLeft: theme.spacing(2)}}>
                            <TextField
                                size='small'
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="smsfAccountName"
                                label="Account name"
                                name="smsfAccountName"
                                value={smsfAccountName}
                                onChange={e => setSmsfAccountName(e.target.value)}
                            />
                            <TextField
                                size='small'
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="smsfAccountBsb"
                                label="Account BSB"
                                name="smsfAccountBsb"
                                value={smsfAccountBsb}
                                onChange={e => setSmsfAccountBsb(e.target.value)}
                            />
                            <TextField
                                size='small'
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="smsfAccountNumber"
                                label="Account number"
                                name="smsfAccountNumber"
                                value={smsfAccountNumber}
                                onChange={e => setSmsfAccountNumber(e.target.value)}
                            />
                            <TextField
                                size='small'
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="smsfElectronicServiceAddress"
                                label="Electronic service address"
                                name="smsfElectronicServiceAddress"
                                value={smsfElectronicServiceAddress}
                                onChange={e => setSmsfElectronicServiceAddress(e.target.value)}
                            />
                        </div>
                        : <div style={{paddingTop: theme.spacing(2), paddingLeft: theme.spacing(2)}}>
                            <TextField
                                size='small'
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id="superSpinNumber"
                                label="Spin number/USI"
                                name="superSpinNumber"
                                value={superSpinNumber}
                                onChange={e => setSuperSpinNumber(e.target.value)}
                            />
                            <TextField
                                size='small'
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="superMemberNumber"
                                label="Member number"
                                name="superMemberNumber"
                                value={superMemberNumber}
                                onChange={e => setSuperMemberNumber(e.target.value)}
                            />
                        </div>
                    }
                    <Typography variant='caption'>Superannuation payments are made quarterly by: 28 January, 28 April, 28 July and 28 October.</Typography>
                </div>
                <div className={classes.tfn}>
                    <Typography variant='h6' color={"primary"}>Tax file number details</Typography>
                    <TextField
                        size='small'
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="tfn"
                        label="Tax file number"
                        name="tfn"
                        value={tfn}
                        onChange={e => setTfn(e.target.value)}
                    />
                    <div style={{ marginTop: theme.spacing(1) }}>
                        <Typography variant='caption'>If you have changed your name since you last dealt with the ATO, provide your previous family name.</Typography>
                        <TextField
                            size='small'
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="previousLastName"
                            label="Previous family name"
                            name="previousLastName"
                            value={previousLastName}
                            onChange={e => setPreviousLastName(e.target.value)}
                        />
                    </div>
                    <Tooltip
                        title={
                            <>
                                <Typography>tax purposes if you:</Typography>
                                <ul>
                                    <li>Have always lived in Australia or have come to Australia and now live here permanently</li>
                                    <li>Are an overseas student doing a course that takes more than six months to complete</li>
                                    <li>Migrate to Australia and intend to reside here permanently</li>
                                </ul>

                            </>
                        }
                    >
                        <Typography variant='subtitle1' color='primary' className={classes.margin}>Are you an Australian resident for tax purposes ?</Typography>
                    </Tooltip>
                    <RadioGroup onChange={(e) => setTaxPurposes(e.target.value)} value={taxPurposes} >
                        <FormControlLabel value='Yes' control={<Radio color='primary' required />} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required />} label='No' />
                    </RadioGroup>
                    <Tooltip
                        title={
                            <>
                                <Typography>Only answer yes if:</Typography>
                                <ul>
                                    <li>You are not currently claiming the tax-free threshold from another payer</li>
                                    <li>You are currently claiming the tax-free threshold from another payer and your total income from all sources will be less than $18,200.</li>
                                </ul>

                            </>
                        }
                    >
                        <Typography variant='subtitle1' color='primary' className={classes.margin}>Do you want to claim the tax-free threshold from this payer ?</Typography>
                    </Tooltip>
                    <RadioGroup onChange={(e) => setTaxFreeThreshold(e.target.value)} value={taxFreeThreshold} >
                        <FormControlLabel value='Yes' control={<Radio color='primary' required />} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required />} label='No' />
                    </RadioGroup>
                    <Typography variant='subtitle1' color='primary' className={classes.margin}>Do you have a Higher Education Loan Program (HELP), Student Start‑up Loan (SSL) or Trade Support Loan (TSL) debt ?</Typography>
                    <RadioGroup onChange={(e) => setLoan(e.target.value)} value={loan} >
                        <FormControlLabel value='Yes' control={<Radio color='primary' required />} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required />} label='No' />
                    </RadioGroup>
                    <Typography variant='subtitle1' color='primary' className={classes.margin}>Do you have a Financial Supplement debt ?</Typography>
                    <RadioGroup onChange={(e) => setDebt(e.target.value)} value={debt} >
                        <FormControlLabel value='Yes' control={<Radio color='primary' required />} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required />} label='No' />
                    </RadioGroup>
                    <Typography variant='subtitle1' color='primary' className={classes.margin}>Do you want to claim the seniors and pensioners tax offset by reducing the amount withheld from payments made to you ?</Typography>
                    <RadioGroup onChange={(e) => setTaxOffset(e.target.value)} value={taxOffset} >
                        <FormControlLabel value='Yes' control={<Radio color='primary' required />} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required />} label='No' />
                    </RadioGroup>
                    <Typography variant='subtitle1' color='primary' className={classes.margin}>Do you want to claim a zone, overseas forces or invalid and invalid carer tax offset by reducing the amount withheld from payments made to you ?</Typography>
                    <RadioGroup onChange={(e) => setPaymentReducation(e.target.value)} value={paymentReducation} >
                        <FormControlLabel value='Yes' control={<Radio color='primary' required />} label='Yes' />
                        <FormControlLabel value='No' control={<Radio color='primary' required />} label='No' />
                    </RadioGroup>
                    <Typography variant='caption'>These details are required in order to determine the amount of tax to withhold from your pay. Your information is protected by our privacy statement.</Typography>
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
                    <Button variant='contained' color='primary' type='submit'>
                        Next
                    </Button>
                </div>
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
            </form>
        </div>
    );
}