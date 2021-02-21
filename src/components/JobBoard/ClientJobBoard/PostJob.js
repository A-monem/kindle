import React, { useState, useEffect } from 'react';
import {
  Button, TextField, FormControlLabel, Checkbox, Paper, Typography, RadioGroup, Radio, FormGroup,
  Tooltip, IconButton, Icon, MenuItem, Table, TableContainer, TableHead, TableBody,
  TableCell, TableRow, Collapse,
} from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded'
import { firebasePostJob, firebaseDeleteJob, auth } from '../../../api/Firebase'
import { useUser } from '../../../context/UserContext'
import { keyIdGenerator } from '../../../api/RandomId'
import { arrays } from '../../../constants'
import { useAlert } from '../../../context/AlertContext'

function PostJob({
  edit, setEdit, jobToBeEdited, setOpenModal,
}) {
  const [title, setTitle] = useState('')
  const [address, setAddress] = useState('')
  const [genderPreference, setGenderPreference] = useState('')
  const [supportType, setSupportType] = useState([])
  const [supportTypeChosen, setSupportTypeChosen] = useState([])
  const [jobType, setJobType] = useState('')
  const [supportActivities, setSupportActivities] = useState('')
  const [hours, setHours] = useState('')
  const [supportTime, setSupportTime] = useState('')
  const [particularSupportTime, setParticularSupportTime] = useState([])
  const [daySelected, setDaySelected] = useState('')
  const [timeSelected, setTimeSelected] = useState('')

  const { user } = useUser()
  const { showErrorAlert } = useAlert()
  const theme = useTheme()

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
      width: '60%',
      overflow: 'auto',
      margin: theme.spacing(2),
      padding: theme.spacing(2),
      [theme.breakpoints.down('md')]: {
        width: '90%',
      },
    },
    margin: {
      marginTop: theme.spacing(2),
    },
    spaceBetweenRow: {
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
      showErrorAlert('Please select a day and time before adding')
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
      firebaseDeleteJob(jobToBeEdited.postTime)
        .then(() => {
          firebasePostJob(job)
            .catch((error) => {
              if (error.message) {
                showErrorAlert(error.message)
              } else {
                showErrorAlert('Failed to edit job. Please contact Kindle support')
              }
            })
        })
        .catch((error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Failed to edit job. Please contact Kindle support')
          }
        })
    } else {
      firebasePostJob(job)
        .catch((error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Failed to post job. Please contact Kindle support')
          }
        })
    }

    clearState()
    setOpenModal(false)
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.spaceBetweenRow}>
        <Typography variant="h6">{edit ? 'Edit a job' : 'Post a job'}</Typography>
        <IconButton
          onClick={() => {
            setOpenModal(false)
          }}
        >
          <CancelRoundedIcon />
        </IconButton>
      </div>
      <form onSubmit={(e) => handlePostSubmit(e)}>
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
        <FormGroup>
          {arrays.supportTypeArray.filter((item) => supportTypeChosen.includes(item.title)).map((item) => (
            <Tooltip
              key={keyIdGenerator()}
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
        <Collapse in={supportTime === 'Yes'}>
          <Typography variant="subtitle1" color="primary" className={classes.margin}>Which particular days and times do you need?</Typography>
          <div className={classes.spaceBetweenRow}>
            <TextField
              fullWidth
              select
              size="small"
              label="Select a day"
              value={daySelected}
              onChange={(e) => setDaySelected(e.target.value)}
              variant="outlined"
            >
              {arrays.days.map((option) => (
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
              {arrays.times.map((option) => (
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
                  {particularSupportTime.map((row) => (
                    <TableRow key={keyIdGenerator()}>
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
        </Collapse>
        <div className={classes.submitButton}>
          <Button variant="contained" type="submit">Post</Button>
          <Button variant="contained" type="button" onClick={() => setOpenModal(false)} style={{ marginLeft: theme.spacing(1) }}>Cancel</Button>
        </div>
      </form>
    </Paper>
  );
}

PostJob.propTypes = {
  edit: PropTypes.bool.isRequired,
  setEdit: PropTypes.func.isRequired,
  jobToBeEdited: PropTypes.object,
  setOpenModal: PropTypes.func.isRequired,
}

export default PostJob
