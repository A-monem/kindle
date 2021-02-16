import React, { useState, useEffect, useContext } from 'react';
import {
  Button, TextField, FormControlLabel, Checkbox, Paper, Typography, RadioGroup, Radio, FormGroup,
  Tooltip, IconButton, Icon, MenuItem, Table, TableContainer, TableHead, TableBody,
  TableCell, TableRow, Snackbar,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles, useTheme } from '@material-ui/core/styles'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { firebasePostJob, firebaseDeleteJob, auth } from '../../../api/Firebase'
import { UserContext } from '../../../context/UserContext'

export default function PostJob({ edit, setEdit, jobToBeEdited }) {
  const [openError, setOpenError] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [genderPreference, setGenderPreference] = useState('')
  const [supportType, setSupportType] = useState([])
  const [supportTypeChosen, setSupportTypeChosen] = useState([])
  const supportTypeArray = [{ title: 'Help around the house', toolTip: 'Help around the house is important for you to be able to remain independently at home. This might include help in the graden, home-office duties and keeping the house tidy by assisting with laundry, taking out the rubbish or feeding pets.' },
    { title: 'In-home care', toolTip: 'In-home care is important to help you maintain your independence. This includes assistance with morning and evening routines, showring and toileting, mealtime preparation and medication reminders.' },
    { title: 'Personal care', toolTip: 'Personal care and hygiene support is important for maintaining an active and social lifestyle. This might include toileting (in the home or out in the community) and mealtime assistance' },
    { title: 'Outdoor care', toolTip: 'This might include anything from shopping to fitness, to joining a new community group to social events.' },
    { title: 'Education, training and employment', toolTip: 'This might include assisting you at school, in the classroom or in the playground, at university or TAFE, in the workplace or to develop new skills.' },
    { title: 'Therapy support', toolTip: 'Therapy support is designed to help you if you have an early intervention, developmental services, physiotherapy, occupational therapy or speech pathology plan. Your worker will follow your individualised program to help with the ongoing implementation of your therapy at home and in other environments.' },
    { title: 'Transport', toolTip: "Transport support is helping you to get ready, accompanying and providing assistance at the destination, and ensuring you return home safely. Depending on your worker's preference this might be in your car or theirs." }]
  const [jobType, setJobType] = useState('')
  const [supportActivities, setSupportActivities] = useState('')
  const [hours, setHours] = useState('')
  const [supportTime, setSupportTime] = useState('')
  const [particularSupportTime, setParticularSupportTime] = useState([])
  const [daySelected, setDaySelected] = useState('')
  const [timeSelected, setTimeSelected] = useState('')
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const times = ['Morning', 'Afternoon', 'Evening']
  const theme = useTheme()
  const { user } = useContext(UserContext)

  useEffect(() => {
    setAddress(`${user.address.suburb}, ${user.address.stateAus}`)
    setGenderPreference(user.disabilityInfo.genderPreference)
    setSupportTypeChosen([...user.disabilityInfo.supportType])

    if (edit) {
      setTitle(jobToBeEdited.title)
      setSupportType(jobToBeEdited.supportType)
      setJobType(jobToBeEdited.jobType)
      setSupportActivities(jobToBeEdited.supportActivities)
      setHours(jobToBeEdited.hours)
      setSupportTime(jobToBeEdited.supportTime)
      setParticularSupportTime(jobToBeEdited.particularSupportTime)
    }
  }, [edit])

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    margin: {
      marginTop: theme.spacing(2),
    },
    form: {
      width: '100%',
    },
    particularDaysSelect: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    submitButton: {
      marginTop: theme.spacing(2),
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
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
  const handleSupportTypeChange = (e) => {
    let supportTypeHolder = supportType

    if (!supportType.includes(e.target.value)) {
      supportTypeHolder.push(e.target.value)
    } else {
      supportTypeHolder = supportTypeHolder.filter((item) => item !== e.target.value)
    }

    setSupportType([...supportTypeHolder])
  }
  const handleAddParticularDayTime = () => {
    if (daySelected && timeSelected) {
      const arr = [...particularSupportTime]

      arr.push({
        day: daySelected,
        time: timeSelected,
      })

      setParticularSupportTime(arr)
      setDaySelected('')
      setTimeSelected('')
    } else {
      setMessage('Please select a day and time before adding')
      setOpenError(true)
    }
  }
  const handleDeleteParticularDayTime = (row) => {
    const arr = particularSupportTime.filter((item) => {
      if (item.day === row.day && item.time === row.time) {
        return false
      }

      return true
    })

    setParticularSupportTime(arr)
  }
  const clearState = () => {
    setOpenError(false)
    setOpenSuccess(false)
    setMessage('')
    setTitle('')
    setSupportType([])
    setJobType('')
    setSupportActivities('')
    setHours('')
    setSupportTime('')
    setParticularSupportTime([])
    setDaySelected('')
    setTimeSelected('')
    setEdit(false)
  }
  const handlePostSubmit = (e) => {
    e.preventDefault()
    console.log(user)

    const job = {
      name: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      clientId: auth.currentUser.uid,
      title,
      address,
      genderPreference,
      supportType,
      jobType,
      supportActivities,
      hours,
      supportTime,
      particularSupportTime,
      postTime: edit ? jobToBeEdited.postTime : Date.now(),
      status: 'Open',
    }

    if (edit) {
      console.log('edit')
      firebaseDeleteJob(jobToBeEdited.postTime)
        .then(() => {
          firebasePostJob(job)
            .catch((error) => {
              setMessage(error)
              setOpenError(true)
            })
        })
        .catch((error) => {
          setMessage(error)
          setOpenError(true)
        })
    } else {
      console.log(job)
      firebasePostJob(job)
        .catch((error) => {
          console.log(error)
          setMessage('Failed to post a job. Please contact Kindle support')
          setOpenError(true)
        })
    }

    clearState()
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6">{edit ? 'Edit a job' : 'Post a job'}</Typography>
      <form className={classes.form} onSubmit={(e) => handlePostSubmit(e)}>
        <Typography variant="subtitle1" color="primary">Enter the name of your job post</Typography>
        <TextField
          fullWidth
          required
          size="small"
          variant="outlined"
          margin="normal"
          label="Title"
          value={title}
          placeholder="Support worker two days a week"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Typography variant="subtitle1" color="primary" className={classes.margin}>Address</Typography>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          margin="normal"
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Typography variant="subtitle1" color="primary" className={classes.margin}>Prefered gender</Typography>
        <RadioGroup onChange={(e) => setGenderPreference(e.target.value)} value={genderPreference}>
          <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
          <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
          <FormControlLabel value="No" control={<Radio color="primary" />} label="No Preference" />
        </RadioGroup>
        <Typography variant="subtitle1" color="primary" className={classes.margin}>Type of support</Typography>
        {supportTypeArray
          ? (
            <FormGroup>
              {supportTypeArray.filter((item) => supportTypeChosen.includes(item.title)).map((item, i) => (
                <Tooltip
                  key={i}
                  placement="top"
                  title={<div><Typography style={{ width: '100%', padding: theme.spacing(2) }}>{item.toolTip}</Typography></div>}
                >
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
                </Tooltip>
              ))}
            </FormGroup>
          )
          : null}
        <Typography variant="subtitle1" color="primary" className={classes.margin}>Job Type</Typography>
        <RadioGroup onChange={(e) => setJobType(e.target.value)} value={jobType}>
          <FormControlLabel value="Ongoing" control={<Radio color="primary" required />} label="Ongoing" />
          <FormControlLabel value="Once" control={<Radio color="primary" required />} label="Once off" />
        </RadioGroup>
        <Typography variant="subtitle1" color="primary" className={classes.margin}>Describe the support activities in detail</Typography>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Support activities"
          name="bio"
          multiline
          rows={7}
          value={supportActivities}
          onChange={(e) => setSupportActivities(e.target.value)}
        />
        <Typography variant="subtitle1" color="primary" className={classes.margin}>How many hours are you looking for ?</Typography>
        <RadioGroup onChange={(e) => setHours(e.target.value)} value={hours}>
          <FormControlLabel value="Less than 5 hours" control={<Radio color="primary" required />} label="Less than 5 hours" />
          <FormControlLabel value="5 - 10 hours" control={<Radio color="primary" required />} label="5 - 10 hours" />
          <FormControlLabel value="10 - 15 hours" control={<Radio color="primary" required />} label="10 - 15 hours" />
          <FormControlLabel value="More than 15 hours" control={<Radio color="primary" required />} label="More than 15 hours" />
        </RadioGroup>
        <Typography variant="subtitle1" color="primary" className={classes.margin}>Do you require support on a particular time ?</Typography>
        <RadioGroup onChange={(e) => setSupportTime(e.target.value)} value={supportTime}>
          <FormControlLabel value="Yes" control={<Radio color="primary" required />} label="Yes" />
          <FormControlLabel value="No" control={<Radio color="primary" required />} label="No" />
        </RadioGroup>
        {supportTime === 'Yes'
          ? (
            <>
              <Typography variant="subtitle1" color="primary" className={classes.margin}>Which particular days and times do you need?</Typography>
              <div className={classes.particularDaysSelect}>
                <TextField
                  fullWidth
                  select
                  size="small"
                  label="Select a day"
                  value={daySelected}
                  onChange={(e) => setDaySelected(e.target.value)}
                  variant="outlined"
                >
                  {days.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Select time"
                  fullWidth
                  value={timeSelected}
                  onChange={(e) => setTimeSelected(e.target.value)}
                  variant="outlined"
                >
                  {times.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton onClick={handleAddParticularDayTime}>
                  <Icon color="primary" fontSize="large">add_circle</Icon>
                </IconButton>
              </div>
              <div>
                <TableContainer component={Paper} className={classes.margin}>
                  <Table size="small" aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Day</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell align="right" />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {particularSupportTime.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell component="th" scope="row">
                            {row.day}
                          </TableCell>
                          <TableCell>{row.time}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => handleDeleteParticularDayTime(row)}>
                              <DeleteForeverIcon color="primary" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </>
          )
          : null}
        <div className={classes.submitButton}>
          <Button variant="outlined" color="secondary" type="submit">Post</Button>
        </div>

      </form>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error">
          {message}
        </Alert>
      </Snackbar>
      <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
