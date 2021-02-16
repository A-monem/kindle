import React, { useState, useEffect } from 'react';
import {
  Typography, RadioGroup, Radio, FormControlLabel, FormGroup, TextField, MenuItem, Checkbox, Tooltip,
  Box, Collapse,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import InfoIcon from '@material-ui/icons/Info'
import { firebaseAddUserInfo } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
import { keyIdGenerator } from '../../../api/RandomId'
import { arrays, strings } from '../../../constants'
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'

function ClientRegistrationStepTwo({ activeStep, setActiveStep }) {
  const [supportTime, setSupportTime] = useState('')
  const [disability, setDisability] = useState('')
  const [supportType, setSupportType] = useState([])
  const [behaviourSupport, setBehaviourSupport] = useState('')
  const [restrictivePractices, setRestrictivePractices] = useState('')
  const [medication, setMedication] = useState('')
  const [administerMedication, setAdministerMedication] = useState('')
  const [genderPreference, setGenderPreference] = useState('')

  const { user, addUser } = useUser()
  const { showErrorAlert } = useAlert()
  const theme = useTheme()

  useEffect(() => {
    document.getElementById('kindleApp').scrollIntoView();

    if (user.disabilityInfo) {
      setSupportTime(user.disabilityInfo.supportTime)
      setDisability(user.disabilityInfo.disability)
      setSupportType(user.disabilityInfo.supportType)
      setBehaviourSupport(user.disabilityInfo.behaviourSupport)
      setRestrictivePractices(user.disabilityInfo.restrictivePractices)
      setMedication(user.disabilityInfo.medication)
      setAdministerMedication(user.disabilityInfo.administerMedication)
      setGenderPreference(user.disabilityInfo.genderPreference)
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
    supportTypeOptions: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  }))
  const classes = useStyles()

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }
  const handleSupportTypeChange = (e) => {
    let supportTypeHolder = supportType

    if (e.target.checked) {
      supportTypeHolder.push(e.target.value)
    } else {
      supportTypeHolder = supportTypeHolder.filter((item) => item !== e.target.value)
    }

    setSupportType([...supportTypeHolder])
  }
  const checkFields = () => {
    if (supportTime) {
      if (disability) {
        if (supportType.length >= 1) {
          if (behaviourSupport) {
            if ((behaviourSupport === 'Yes' && restrictivePractices) || behaviourSupport === 'No') {
              if (medication) {
                if ((medication === 'Yes' && administerMedication) || medication === 'No') {
                  if (genderPreference) {
                    return true
                  }

                  showErrorAlert('Please make sure you have selected a gender preference')

                  return false
                }

                showErrorAlert('Please make sure you have selected whether you need woker to administer medication')

                return false
              }

              showErrorAlert('Please make sure you have selected whether you take prescribed medication')

              return false
            }

            showErrorAlert('Please make sure you have selected whether you need restrictive practices')

            return false
          }

          showErrorAlert('Please make sure you have selected whether you need positive behaviour support')

          return false
        }

        showErrorAlert('Please make sure you have selected one or more support type')

        return false
      }

      showErrorAlert('Please make sure you have wrote a little bit about your disability')

      return false
    }

    showErrorAlert('Please make sure you have selected how much support you need each week')

    return false
  }
  const handleNext = (e) => {
    e.preventDefault()

    const check = checkFields()
    const disabilityInfo = {
      supportTime,
      disability,
      supportType,
      behaviourSupport,
      restrictivePractices,
      medication,
      administerMedication,
      genderPreference,
    }

    if (check) {
      firebaseAddUserInfo('disabilityInfo', disabilityInfo)
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
    }
  };

  return (
    <div className={classes.root}>
      <form style={{ width: '100%' }} onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">1) How much one to one support do you need each week ?</Typography>
          <div className={classes.fullWidthOnMedium}>
            <TextField
              required
              fullWidth
              select
              size="small"
              label="Select a period"
              value={supportTime}
              onChange={(e) => setSupportTime(e.target.value)}
              variant="outlined"
              className={classes.margin}
            >
              {arrays.supportTimeEachWeekArray.map((option) => (
                <MenuItem key={keyIdGenerator()} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">2) Tell us a little bit more about your disability ?</Typography>
          <div className={classes.fullWidthOnMedium}>
            <TextField
              required
              variant="outlined"
              margin="normal"
              fullWidth
              id="bio"
              label="disability"
              name="bio"
              multiline
              rows={7}
              value={disability}
              onChange={(e) => setDisability(e.target.value)}
            />
          </div>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">3) What type of support do you need ?</Typography>
          <div className={classes.fullWidthOnMedium}>
            <FormGroup>
              {arrays.supportTypeArray.map((item) => (
                <div key={keyIdGenerator()} className={classes.supportTypeOptions}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        onChange={handleSupportTypeChange}
                        color="primary"
                        value={item.title}
                        name={item.title}
                        checked={supportType.includes(item.title)}
                      />
                  )}
                    label={item.title}
                  />
                  <Tooltip title={item.toolTip} placement="right">
                    <InfoIcon color="secondary" />
                  </Tooltip>
                </div>
              ))}
            </FormGroup>
          </div>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">4) Do you require any positive behaviour support ?</Typography>
          <RadioGroup onChange={(e) => setBehaviourSupport(e.target.value)} value={behaviourSupport}>
            <FormControlLabel value="Yes" control={<Radio color="primary" required />} label="Yes" />
            <FormControlLabel value="No" control={<Radio color="primary" required />} label="No" />
          </RadioGroup>
          <Collapse in={behaviourSupport === 'Yes'}>
            <>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="subtitle1" color="primary">Will any of the workers be required to use restrictive practices ?</Typography>
                <Tooltip title={strings.restrictivePracticesTooltip} style={{ marginLeft: theme.spacing(1) }}>
                  <InfoIcon color="secondary" />
                </Tooltip>
              </div>
              <RadioGroup onChange={(e) => setRestrictivePractices(e.target.value)} value={restrictivePractices}>
                <FormControlLabel value="Yes" control={<Radio color="primary" required={behaviourSupport === 'Yes'} />} label="Yes" />
                <FormControlLabel value="No" control={<Radio color="primary" required={behaviourSupport === 'Yes'} />} label="No" />
              </RadioGroup>
            </>
          </Collapse>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">5) Do you take any prescribed medication ?</Typography>
          <RadioGroup onChange={(e) => setMedication(e.target.value)} value={medication}>
            <FormControlLabel value="Yes" control={<Radio color="primary" required />} label="Yes" />
            <FormControlLabel value="No" control={<Radio color="primary" required />} label="No" />
          </RadioGroup>
          <Collapse in={medication === 'Yes'}>
            <>
              <Typography variant="subtitle1" color="primary">Will any of the workers be required to administer medication ?</Typography>
              <RadioGroup onChange={(e) => setAdministerMedication(e.target.value)} value={administerMedication}>
                <FormControlLabel value="Yes" control={<Radio color="primary" required={medication === 'Yes'} />} label="Yes" />
                <FormControlLabel value="No" control={<Radio color="primary" required={medication === 'Yes'} />} label="No" />
              </RadioGroup>
            </>
          </Collapse>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">6) Do you have a gender preference for who supports you ?</Typography>
          <RadioGroup onChange={(e) => setGenderPreference(e.target.value)} value={genderPreference}>
            <FormControlLabel value="Male" control={<Radio color="primary" required />} label="Male" />
            <FormControlLabel value="Female" control={<Radio color="primary" required />} label="Female" />
            <FormControlLabel value="No" control={<Radio color="primary" required />} label="No Preference" />
          </RadioGroup>
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}

ClientRegistrationStepTwo.propTypes = {
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
}

export default ClientRegistrationStepTwo
