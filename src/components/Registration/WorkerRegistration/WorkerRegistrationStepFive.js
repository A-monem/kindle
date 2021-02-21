import React, { useState, useEffect } from 'react'
import {
  Typography, RadioGroup, Radio, FormControlLabel, TextField,
  Checkbox, Tooltip, Box, Collapse,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import InfoIcon from '@material-ui/icons/Info'
import { firebaseAddUserInfo } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'
import { strings, arrays } from '../../../constants'
import { keyIdGenerator } from '../../../api/RandomId'

function RadioGroupTemplate({
  question, options, setFunction, value,
}) {
  return (
    <Box mt={2}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="subtitle2" color="primary">{question}</Typography>
        {options && (
          <Tooltip
            title={(
              <>
                <Typography>Only answer yes if:</Typography>
                <ul>
                  {options.map((option) => (
                    <li key={keyIdGenerator()}>{option}</li>
                  ))}
                </ul>
              </>
          )}
            placement="right"
            style={{ marginLeft: '2%' }}
          >
            <InfoIcon color="secondary" fontSize="small" />
          </Tooltip>
        )}
      </div>
      <RadioGroup onChange={setFunction} value={value}>
        <FormControlLabel value="Yes" control={<Radio color="primary" required />} label="Yes" />
        <FormControlLabel value="No" control={<Radio color="primary" required />} label="No" />
      </RadioGroup>
    </Box>
  )
}

RadioGroupTemplate.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.array,
  setFunction: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

function WorkerRegistrationStepFive({ activeStep, setActiveStep }) {
  const [legalName, setLegalName] = useState({
    hasPreviousLegalName: '',
    legalFirstName: '',
    legalLastName: '',
  })
  const [bankAccountDetails, setBankAccountDetails] = useState({
    accountName: '',
    bsb: '',
    accountNumber: '',
  })
  const [superDetails, setSuperDetails] = useState({
    smsf: false,
    fundName: '',
    fundAbn: '',
    smsfAccountName: '',
    smsfAccountBsb: '',
    smsfAccountNumber: '',
    smsfElectronicServiceAddress: '',
    superSpinNumber: '',
    superMemberNumber: '',
  })
  const [taxDetails, setTaxDetails] = useState({
    tfn: '',
    australianResidentForTaxPurposes: '',
    differentLastName: '',
    previousLastName: '',
    taxFreeThreshold: '',
    loan: '',
    financialSupplementDebt: '',
    seniorAndPensionerTaxOffset: '',
    paymentReducation: '',
  })

  const { user, addUser } = useUser()
  const theme = useTheme()
  const { showErrorAlert } = useAlert()

  useEffect(() => {
    document.getElementById('kindleApp').scrollIntoView();

    if (user.financialInfo) {
      setLegalName(user.financialInfo.legalName)
      setBankAccountDetails(user.financialInfo.bankAccountDetails)
      setSuperDetails(user.financialInfo.superDetails)
      setTaxDetails(user.financialInfo.taxDetails)
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
    fullWidthOnMedium: {
      width: '50%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    margin: {
      marginTop: theme.spacing(2),
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

    const financialInfo = {
      legalName,
      bankAccountDetails,
      superDetails,
      taxDetails,
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
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <div>
        <Typography variant="caption">{strings.financial_info_discalimer}</Typography>
      </div>
      <form onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">Legal name</Typography>
          <RadioGroupTemplate
            question="Is your legal name different to the one you used to create your profile ?"
            setFunction={(e) => setLegalName({ ...legalName, hasPreviousLegalName: e.target.value })}
            value={legalName.hasPreviousLegalName}
          />
          <Collapse in={legalName.hasPreviousLegalName === 'Yes'}>
            <div className={classes.fullWidthOnMedium}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required={legalName.hasPreviousLegalName === 'Yes'}
                fullWidth
                id="legalFirstName"
                label="Legal first name"
                name="legalFirstName"
                value={legalName.legalFirstName}
                onChange={(e) => setLegalName({ ...legalName, legalFirstName: e.target.value })}
              />
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required={legalName.hasPreviousLegalName === 'Yes'}
                fullWidth
                id="legalLastName"
                label="Legal last name"
                name="legalLastName"
                value={legalName.legalLastName}
                onChange={(e) => setLegalName({ ...legalName, legalLastName: e.target.value })}
              />
            </div>
            <Typography variant="caption">{strings.legal_name_disclaimer}</Typography>
          </Collapse>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">Bank account details</Typography>
          <div className={classes.fullWidthOnMedium}>
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="accountName"
              label="Account name"
              name="accountName"
              value={bankAccountDetails.accountName}
              onChange={(e) => setBankAccountDetails({ ...bankAccountDetails, accountName: e.target.value })}
            />
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="bankBsb"
              label="BSB"
              name="bankBsb"
              value={bankAccountDetails.bsb}
              onChange={(e) => setBankAccountDetails({ ...bankAccountDetails, bsb: e.target.value })}
            />
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="accountNumber"
              label="Account number"
              name="accountNumber"
              value={bankAccountDetails.accountNumber}
              onChange={(e) => setBankAccountDetails({ ...bankAccountDetails, accountNumber: e.target.value })}
            />
          </div>
          <Typography variant="caption">{strings.payroll_disclaimer}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">Supperannuation</Typography>
          <FormControlLabel
            control={<Checkbox onChange={() => setSuperDetails({ ...superDetails, smsf: !superDetails.smsf })} color="primary" name="smsf" />}
            label="Self-managed fund"
            checked={superDetails.smsf}
            style={{ marginTop: theme.spacing(1) }}
          />
          <div className={classes.fullWidthOnMedium}>
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="fundName"
              label="Fund name"
              name="fundName"
              value={superDetails.fundName}
              onChange={(e) => setSuperDetails({ ...superDetails, fundName: e.target.value })}
            />
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="fundAbn"
              label="Fund ABN"
              name="fundAbn"
              value={superDetails.fundAbn}
              onChange={(e) => setSuperDetails({ ...superDetails, fundAbn: e.target.value })}
            />
            <Collapse in={superDetails.smsf}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required={superDetails.smsf}
                fullWidth
                id="smsfAccountName"
                label="Account name"
                name="smsfAccountName"
                value={superDetails.smsfAccountName}
                onChange={(e) => setSuperDetails({ ...superDetails, smsfAccountName: e.target.value })}
              />
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required={superDetails.smsf}
                fullWidth
                id="smsfAccountBsb"
                label="Account BSB"
                name="smsfAccountBsb"
                value={superDetails.smsfAccountBsb}
                onChange={(e) => setSuperDetails({ ...superDetails, smsfAccountBsb: e.target.value })}
              />
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required={superDetails.smsf}
                fullWidth
                id="smsfAccountNumber"
                label="Account number"
                name="smsfAccountNumber"
                value={superDetails.smsfAccountNumber}
                onChange={(e) => setSuperDetails({ ...superDetails, smsfAccountNumber: e.target.value })}
              />
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required={superDetails.smsf}
                fullWidth
                type="email"
                autoComplete="email"
                id="smsfElectronicServiceAddress"
                label="Electronic service address"
                name="smsfElectronicServiceAddress"
                value={superDetails.smsfElectronicServiceAddress}
                onChange={(e) => setSuperDetails({ ...superDetails, smsfElectronicServiceAddress: e.target.value })}
              />
            </Collapse>
            <Collapse in={!superDetails.smsf}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                id="superSpinNumber"
                label="Spin number/USI"
                name="superSpinNumber"
                value={superDetails.superSpinNumber}
                onChange={(e) => setSuperDetails({ ...superDetails, superSpinNumber: e.target.value })}
              />
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                required={!superDetails.smsf}
                fullWidth
                id="superMemberNumber"
                label="Member number"
                name="superMemberNumber"
                value={superDetails.superMemberNumber}
                onChange={(e) => setSuperDetails({ ...superDetails, superMemberNumber: e.target.value })}
              />
            </Collapse>
          </div>
          <Typography variant="caption">{strings.payments_disclaimer}</Typography>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">Tax file number details</Typography>
          <div className={classes.fullWidthOnMedium}>
            <TextField
              size="small"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="tfn"
              label="Tax file number"
              name="tfn"
              value={taxDetails.tfn}
              onChange={(e) => setTaxDetails({ ...taxDetails, tfn: e.target.value })}
            />
          </div>
          <RadioGroupTemplate
            question={`Do you have a previous family name that is different than ${user.lastName} ?`}
            setFunction={(e) => setTaxDetails({ ...taxDetails, differentLastName: e.target.value })}
            value={taxDetails.differentLastName}
          />
          <Collapse in={taxDetails.differentLastName === 'Yes'}>
            <div className={classes.fullWidthOnMedium}>
              <TextField
                size="small"
                variant="outlined"
                margin="normal"
                fullWidth
                required={taxDetails.differentLastName === 'Yes'}
                id="previousLastName"
                label="Previous family name"
                name="previousLastName"
                value={taxDetails.previousLastName}
                onChange={(e) => setTaxDetails({ ...taxDetails, previousLastName: e.target.value })}
              />
            </div>
          </Collapse>
          <RadioGroupTemplate
            question="Are you an Australian resident for tax purposes ?"
            options={arrays.australianResidentForTaxPurpose}
            setFunction={(e) => setTaxDetails({ ...taxDetails, australianResidentForTaxPurposes: e.target.value })}
            value={taxDetails.australianResidentForTaxPurposes}
          />
          <RadioGroupTemplate
            question="Do you want to claim the tax-free threshold from this payer ?"
            options={arrays.taxFreeThreshold}
            setFunction={(e) => setTaxDetails({ ...taxDetails, taxFreeThreshold: e.target.value })}
            value={taxDetails.taxFreeThreshold}
          />
          <RadioGroupTemplate
            question="Do you have a Higher Education Loan Program (HELP), Student Start‑up Loan (SSL) or Trade Support Loan (TSL) debt ?"
            setFunction={(e) => setTaxDetails({ ...taxDetails, loan: e.target.value })}
            value={taxDetails.loan}
          />
          <RadioGroupTemplate
            question="Do you have a Financial Supplement debt ?"
            setFunction={(e) => setTaxDetails({ ...taxDetails, financialSupplementDebt: e.target.value })}
            value={taxDetails.financialSupplementDebt}
          />
          <RadioGroupTemplate
            question="Do you want to claim the seniors and pensioners tax offset by reducing the amount withheld from payments made to you ?"
            setFunction={(e) => setTaxDetails({ ...taxDetails, seniorAndPensionerTaxOffset: e.target.value })}
            value={taxDetails.seniorAndPensionerTaxOffset}
          />
          <RadioGroupTemplate
            question="Do you want to claim a zone, overseas forces or invalid and invalid carer tax offset by reducing the amount withheld from payments made to you ?"
            setFunction={(e) => setTaxDetails({ ...taxDetails, paymentReducation: e.target.value })}
            value={taxDetails.paymentReducation}
          />
          <Typography variant="caption">{strings.tax_disclaimer}</Typography>
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}

WorkerRegistrationStepFive.propTypes = {
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
}

export default WorkerRegistrationStepFive
