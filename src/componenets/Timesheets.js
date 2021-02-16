import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Typography, Paper, TextField, Snackbar, IconButton, MenuItem, Modal,
  Icon, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
} from '@material-ui/core'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
// import Rating from '@material-ui/lab/Rating';
import { Redirect } from 'react-router-dom'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded'
import 'date-fns'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers'
import { firebaseGetWorkerJobs } from '../api/Firebase'
import Registration from './Registration'
import { UserContext } from '../context/UserContext'
import { keyIdGenerator } from '../api/RandomId'

const TimesheetModal = (props) => {
  const {
    openModal,
    setOpenModal,
    handleCloseModal,
    client,
    setClient,
    dateSelected,
    setDateSelected,
    fromTime,
    setFromTime,
    numberHours,
    setNumberHours,
    rate,
    setRate,
    notes,
    setNotes,
  } = props

  const theme = useTheme()

  const useStyles = makeStyles(() => ({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    margin: {
      margin: theme.spacing(1),
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: theme.spacing(2),
      width: '60%',
    },
    exit: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    buttons: {
      width: '30%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    },
  }))

  const classes = useStyles()

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <div className={classes.exit}>
            <IconButton
              onClick={() => {
                setOpenModal(false)
              }}
            >
              <CancelRoundedIcon />
            </IconButton>
          </div>
          <Typography variant="h6" color="primary">Add a timesheet</Typography>
          <form className={classes.form} onSubmit={(e) => console.log(e)}>
            <div>
              <div className={classes.client}>
                <Typography variant="subtitle1" color="primary">Choose your client</Typography>
                <TextField
                  required
                  select
                  size="small"
                  label="Select Client"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  variant="outlined"
                  className={classes.margin}
                  style={{ width: '50%' }}
                >
                  {['Abdelmoneim Nafea', 'Islam Kahki'].map((clientName) => (
                    <MenuItem key={keyIdGenerator()} value={clientName}>
                      {clientName}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className={classes.jobTime}>
                <Typography variant="subtitle1" color="primary">Add the day you worked</Typography>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    id="date-picker-dialog"
                    label="Select date"
                                        // style={{ width: theme.spacing(25) }}
                    format="dd/MM/yyyy"
                    value={dateSelected}
                    onChange={(date) => setDateSelected(date)}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                  <KeyboardTimePicker
                    id="time-picker"
                    label="From"
                                        // style={{ width: theme.spacing(25) }}
                    value={fromTime}
                    onChange={(date) => setFromTime(date)}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
                <TextField
                  required
                  type="number"
                  size="small"
                  label="Number of hours"
                  value={numberHours}
                  onChange={(e) => setNumberHours(e.target.value)}
                  variant="outlined"
                  className={classes.margin}
                />
              </div>
              <div className={classes.rate}>
                <Typography variant="subtitle1" color="primary">Add the rate</Typography>
                <TextField
                  required
                  size="small"
                  variant="outlined"
                  margin="normal"
                  label="Hourly rate $"
                  value={rate}
                  placeholder="30"
                  onChange={(e) => setRate(e.target.value)}
                  style={{ width: '50%' }}
                />
              </div>
              <div className={classes.jobDetails}>
                <Typography variant="subtitle1" color="primary">Add job notes</Typography>
                <TextField
                  multiline
                  rows={3}
                  required
                  size="small"
                  variant="outlined"
                  margin="normal"
                  label="Add your job notes"
                  value={notes}
                  placeholder="notes"
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div className={classes.buttons}>
              <Button variant="contained" color="primary" type="submit">
                Add
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  // clear all fields
                  setOpenModal(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    </Modal>
  )
}

const TimesheetTable = () => {
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.secondary.main,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  function createData(name, calories, fat, carbs, protein) {
    return {
      name, calories, fat, carbs, protein,
    };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  const useStyles = makeStyles({
    table: {
      width: '80%',
    },
  });

  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.table}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Client name</StyledTableCell>
            <StyledTableCell align="right">Job date</StyledTableCell>
            <StyledTableCell align="right">Start time</StyledTableCell>
            <StyledTableCell align="right">Hours</StyledTableCell>
            <StyledTableCell align="right">Hour rate</StyledTableCell>
            <StyledTableCell align="right">Total due</StyledTableCell>
            <StyledTableCell align="right">Client approval</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={keyIdGenerator()}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.calories}</StyledTableCell>
              <StyledTableCell align="right">{row.fat}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
              <StyledTableCell align="right">{row.carbs}</StyledTableCell>
              <StyledTableCell align="right">{row.protein}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function Timesheets({ history }) {
  const [openError, setOpenError] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [client, setClient] = useState('')
  const [dateSelected, setDateSelected] = useState(new Date())
  const [fromTime, setFromTime] = useState(new Date())
  const [numberHours, setNumberHours] = useState(0)
  const [rate, setRate] = useState(0)
  const [notes, setNotes] = useState('')

  const theme = useTheme()

  const { user } = useContext(UserContext)

  useEffect(() => {
    try {
      firebaseGetWorkerJobs()
    } catch (error) {
      console.log('error from try catch block', error)
    }
  }, [])

  const useStyles = makeStyles(() => ({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    margin: {
      margin: theme.spacing(1),
    },
    paper: {
      width: '80%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
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

  const handleAddTimesheet = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    console.log('close modal')
  }

  if (!user) {
    return <Redirect to="/signin" />
  }

  if (!user.complete) {
    return <Registration history={history} />
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6" color="primary">Timesheets</Typography>
        <IconButton onClick={handleAddTimesheet}>
          <Icon color="primary" fontSize="large">add_circle</Icon>
        </IconButton>
      </Paper>
      <TimesheetTable />

      <TimesheetModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        handleCloseModal={handleCloseModal}
        client={client}
        setClient={setClient}
        dateSelected={dateSelected}
        setDateSelected={setDateSelected}
        fromTime={fromTime}
        setFromTime={setFromTime}
        numberHours={numberHours}
        setNumberHours={setNumberHours}
        rate={rate}
        setRate={setRate}
        notes={notes}
        setNotes={setNotes}
      />

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
  )
}
