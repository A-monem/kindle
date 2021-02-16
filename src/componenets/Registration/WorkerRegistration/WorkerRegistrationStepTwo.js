import React, { useState, useEffect } from 'react';
import {
  Typography, RadioGroup, Radio, FormControlLabel, Box,
  FormGroup, TextField, MenuItem, Checkbox, Tooltip, Collapse,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import InfoIcon from '@material-ui/icons/Info'
import { firebaseAddUserInfo } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
import { arrays, strings } from '../../../constants'
import { keyIdGenerator } from '../../../api/RandomId'
import { useAlert } from '../../../context/AlertContext'
import NextBackButtons from '../NextBackButtons'

function WorkerRegistrationStepTwo({ activeStep, setActiveStep }) {
  const [supportTime, setSupportTime] = useState('')
  const [supportType, setSupportType] = useState([])
  const [renderTransport, setRenderTransport] = useState(false)
  const [drivingLicence, setDrivingLicence] = useState('')
  const [drivingClientCar, setDrivingClientCar] = useState('')
  const [drivingOwnCar, setDrivingOwnCar] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [genderPreference, setGenderPreference] = useState('')
  const [agePreference, setAgrePreference] = useState([])
  const [workType, setWorkType] = useState([])
  const [workAvailability, setWorkAvailability] = useState([])
  const [travelType, setTravelType] = useState('')
  const [visa, setVisa] = useState('')
  const [permissionToCheckVisa, setPermissionToCheckVisa] = useState(false)
  const [paidWorkExperience, setPaidWorkExperience] = useState('')
  const [unpaidWorkExperience, setUnpaidWorkExperience] = useState('')
  const [unpaidWorkExperienceType, setUnpaidWorkExperienceType] = useState([])

  const { user, addUser } = useUser()
  const { showErrorAlert } = useAlert()
  const theme = useTheme()

  useEffect(() => {
    document.getElementById('kindleApp').scrollIntoView();

    if (user.work) {
      setSupportTime(user.work.supportTime)
      setSupportType(user.work.supportType)
      setRenderTransport(user.work.transport)
      setDrivingLicence(user.work.drivingLicence)
      setDrivingClientCar(user.work.drivingClientCar)
      setDrivingOwnCar(user.work.drivingOwnCar)
      setPlateNumber(user.work.plateNumber)
      setGenderPreference(user.work.genderPreference)
      setAgrePreference(user.work.agePreference)
      setWorkType(user.work.workType)
      setWorkAvailability(user.work.workAvailability)
      setTravelType(user.work.travelType)
      setVisa(user.work.visa)
      setPermissionToCheckVisa(user.work.permissionToCheckVisa)
      setPaidWorkExperience(user.work.paidWorkExperience)
      setUnpaidWorkExperience(user.work.unpaidWorkExperience)
      setUnpaidWorkExperienceType(user.work.unpaidWorkExperienceType)
    }
  }, [])

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexGrow: 1,
      marginTop: theme.spacing(3),
      [theme.breakpoints.down('lg')]: {
        marginTop: theme.spacing(0),
      },
    },
    margin: {
      marginTop: theme.spacing(2),
    },
    padding: {
      padding: theme.spacing(2),
    },
    buttons: {
      width: '100%',
      marginTop: theme.spacing(4),
      display: 'flex',
      justifyContent: 'center',
    },
    backButton: {
      marginRight: theme.spacing(1),
    },
    fullWidthOnMedium: {
      width: '50%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
      },
    },
    supportTypeOptions: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    transport: {
      display: 'flex',
      flexDirection: 'row',
      marginLeft: theme.spacing(2),
    },

  }))

  const classes = useStyles()

  const checkFields = () => {
    if (supportType.length >= 1) {
      if (agePreference.length >= 1) {
        if (workType.length >= 1) {
          if (workAvailability.length >= 1) {
            if (unpaidWorkExperience === 'No' || (unpaidWorkExperience === 'Yes' && unpaidWorkExperienceType.length >= 1)) {
              return true
            }

            showErrorAlert('Please make sure you have selected one or more unpaid work experience types')

            return false
          }

          showErrorAlert('Please make sure you have selected your availability')

          return false
        }

        showErrorAlert('Please make sure you have selected one or more work type')

        return false
      }

      showErrorAlert('Please make sure you have selected one or more age group')

      return false
    }

    showErrorAlert('Please make sure you have selected one or more support type')

    return false
  }

  const handleNext = (e) => {
    e.preventDefault()

    const check = checkFields()
    const work = {
      supportTime,
      supportType,
      transport: renderTransport,
      drivingLicence,
      drivingClientCar,
      drivingOwnCar,
      plateNumber,
      genderPreference,
      agePreference,
      workType,
      workAvailability,
      travelType,
      visa,
      permissionToCheckVisa,
      paidWorkExperience,
      unpaidWorkExperience,
      unpaidWorkExperienceType,
    }

    if (check) {
      firebaseAddUserInfo('work', work)
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

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSupportTypeChange = (e) => {
    let supportTypeHolder = supportType

    if (!supportType.includes(e.target.value)) {
      supportTypeHolder.push(e.target.value)

      if (e.target.value === 'Transport') {
        setRenderTransport(true)
      }
    } else {
      supportTypeHolder = supportTypeHolder.filter((item) => item !== e.target.value)

      if (e.target.value === 'Transport') {
        setRenderTransport(false)
      }
    }

    setSupportType([...supportTypeHolder])
  }

  const handleAgeChange = (e) => {
    let ageGroupHolder = agePreference

    if (!agePreference.includes(e.target.value)) {
      ageGroupHolder.push(e.target.value)
    } else {
      ageGroupHolder = ageGroupHolder.filter((item) => item !== e.target.value)
    }

    setAgrePreference([...ageGroupHolder])
  }

  const handleWorkTypeChange = (e) => {
    if (workType.includes(e.target.value)) {
      const workTypeHolder = workType.filter((item) => item !== e.target.value)

      setWorkType([...workTypeHolder])
    } else {
      const workTypeHolder = workType

      workTypeHolder.push(e.target.value)
      setWorkType([...workTypeHolder])
    }
  }

  const handleWorkAvailabiltyChange = (e) => {
    if (workAvailability.includes(e.target.value)) {
      const workAvailabilityHolder = workAvailability.filter((item) => item !== e.target.value)

      setWorkAvailability([...workAvailabilityHolder])
    } else {
      const workAvailabilityHolder = workAvailability

      workAvailabilityHolder.push(e.target.value)
      setWorkAvailability([...workAvailabilityHolder])
    }
  }

  const handleUnpaidWorkExperienceChange = (e) => {
    if (unpaidWorkExperienceType.includes(e.target.value)) {
      const unpaidWorkExperienceTypeHolder = unpaidWorkExperienceType.filter((item) => item !== e.target.value)

      setUnpaidWorkExperienceType([...unpaidWorkExperienceTypeHolder])
    } else {
      const unpaidWorkExperienceTypeHolder = unpaidWorkExperienceType

      unpaidWorkExperienceTypeHolder.push(e.target.value)
      setUnpaidWorkExperienceType([...unpaidWorkExperienceTypeHolder])
    }
  }

  return (
    <div className={classes.root}>
      <form onSubmit={(e) => handleNext(e)}>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">1) How many hours of support can you provide each week ?</Typography>
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
          <Typography variant="subtitle1" color="primary">2) What type of support can you provide ?</Typography>
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
          <Collapse in={renderTransport}>
            <div style={{ paddingTop: theme.spacing(2), paddingLeft: theme.spacing(2) }}>
              <Typography variant="subtitle1">Transport</Typography>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Typography variant="subtitle2" color="primary">Do you have an unrestricted licence ?</Typography>
                <RadioGroup onChange={(e) => setDrivingLicence(e.target.value)} className={classes.transport} value={drivingLicence}>
                  <FormControlLabel value="Yes" control={<Radio required={renderTransport} />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio required={renderTransport} />} label="No" />
                </RadioGroup>
              </div>
              <Collapse in={drivingLicence === 'Yes'}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="primary">Are you willing to drive your client&apos;s car ?</Typography>
                  <RadioGroup onChange={(e) => setDrivingClientCar(e.target.value)} className={classes.transport} value={drivingClientCar}>
                    <FormControlLabel value="Yes" control={<Radio required={drivingLicence === 'Yes'} />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio required={drivingLicence === 'Yes'} />} label="No" />
                  </RadioGroup>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography variant="subtitle2" color="primary">Will you be driving your own car ?</Typography>
                  <RadioGroup onChange={(e) => setDrivingOwnCar(e.target.value)} className={classes.transport} value={drivingOwnCar}>
                    <FormControlLabel value="Yes" control={<Radio required={drivingLicence === 'Yes'} />} label="Yes" />
                    <FormControlLabel value="No" control={<Radio required={drivingLicence === 'Yes'} />} label="No" />
                  </RadioGroup>
                </div>
                <Collapse in={drivingOwnCar === 'Yes'}>
                  <div style={{
                    display: 'flex', flexDirection: 'row', marginTop: theme.spacing(1), marginBottom: theme.spacing(1),
                  }}
                  >
                    <TextField
                      required={drivingOwnCar === 'Yes'}
                      size="small"
                      label="Your plate number"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                      variant="outlined"
                    />
                  </div>
                </Collapse>
              </Collapse>
            </div>
          </Collapse>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">3) Do you have a gender preference for who you work with ?</Typography>
          <RadioGroup onChange={(e) => setGenderPreference(e.target.value)} value={genderPreference}>
            <FormControlLabel value="Male" control={<Radio required />} label="Male" />
            <FormControlLabel value="Female" control={<Radio required />} label="Female" />
            <FormControlLabel value="No" control={<Radio required />} label="No Preference" />
          </RadioGroup>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">4) Do you have an age preference for who you work with ?</Typography>
          <FormGroup>
            {arrays.ageGroupsOptions.map((item) => (
              <div key={keyIdGenerator()}>
                <FormControlLabel
                  control={<Checkbox onChange={handleAgeChange} value={item} name={item} checked={agePreference.includes(item)} />}
                  label={item}
                />
              </div>
            ))}
          </FormGroup>
          <div className={classes.margin}>
            <Typography variant="caption">{strings.worker_age_preference}</Typography>
          </div>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">5) What type of work are you looking for ?</Typography>
          <FormGroup>
            {arrays.workTypeOptions.map((item) => (
              <div key={keyIdGenerator()}>
                <FormControlLabel
                  control={<Checkbox onChange={handleWorkTypeChange} value={item} name={item} />}
                  label={item}
                  checked={workType.includes(item)}
                />
              </div>
            ))}
          </FormGroup>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">6) When are you available for work ?</Typography>
          <FormGroup>
            {arrays.workAvailabilityOptions.map((item) => (
              <div key={keyIdGenerator()}>
                <FormControlLabel
                  control={<Checkbox onChange={handleWorkAvailabiltyChange} value={item} name={item} />}
                  label={item}
                  checked={workAvailability.includes(item)}
                />
              </div>
            ))}
          </FormGroup>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">7) How will you travel to work ?</Typography>
          <RadioGroup onChange={(e) => setTravelType(e.target.value)} value={travelType}>
            <FormControlLabel value="Drive" control={<Radio color="primary" required />} label="Use my own car" />
            <FormControlLabel value="Public transport" control={<Radio color="primary" required />} label="Use public transportation" />
          </RadioGroup>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">8) Do you have the right to work in Australia ?</Typography>
          <RadioGroup onChange={(e) => setVisa(e.target.value)} value={visa}>
            <FormControlLabel value="Austalian citizen" control={<Radio required />} label="I am an Australian citizen" />
            <FormControlLabel value="New Zealand citizen" control={<Radio required />} label="I am a New Zealand citizen" />
            <FormControlLabel value="Visa" control={<Radio required />} label="My visa allows me to work in Australia" />
          </RadioGroup>
          <Collapse in={visa === 'Visa'}>
            <FormControlLabel
              size="small"
              className={classes.margin}
              control={(
                <Checkbox
                  onChange={() => setPermissionToCheckVisa((prevState) => !prevState)}
                  value={permissionToCheckVisa}
                  name="visa_permission"
                />
                )}
              label="I give permission for Kindle to verify my visa status"
              checked={permissionToCheckVisa}
            />
          </Collapse>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">9) Have you ever had paid experience providing disability support ?</Typography>
          <RadioGroup onChange={(e) => setPaidWorkExperience(e.target.value)} value={paidWorkExperience}>
            <FormControlLabel value="Yes" control={<Radio required />} label="Yes" />
            <FormControlLabel value="No" control={<Radio required />} label="No" />
          </RadioGroup>
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1" color="primary">10) Have you ever had unpaid experience providing disability support ?</Typography>
          <RadioGroup onChange={(e) => setUnpaidWorkExperience(e.target.value)} value={unpaidWorkExperience}>
            <FormControlLabel value="Yes" control={<Radio required />} label="Yes" />
            <FormControlLabel value="No" control={<Radio required />} label="No" />
          </RadioGroup>
          <Collapse in={unpaidWorkExperience === 'Yes'}>
            <FormGroup style={{ padding: theme.spacing(2) }}>
              {arrays.unpaidWorkExperienceOptions.map((item) => (
                <div key={keyIdGenerator()}>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        onChange={handleUnpaidWorkExperienceChange}
                        color="primary"
                        value={item}
                        name={item}
                      />
                    )}
                    label={item}
                    checked={unpaidWorkExperienceType.includes(item)}
                  />
                </div>
              ))}
            </FormGroup>
          </Collapse>
        </Box>
        <NextBackButtons classes={classes} handleBack={handleBack} disable={activeStep === 0} />
      </form>
    </div>
  );
}

WorkerRegistrationStepTwo.propTypes = {
  activeStep: PropTypes.number.isRequired,
  setActiveStep: PropTypes.func.isRequired,
}

export default WorkerRegistrationStepTwo
