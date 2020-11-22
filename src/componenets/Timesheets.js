import React, { useState, useEffect, useContext } from 'react';
import {
    Button, Typography, Paper, FormLabel, TextField, Snackbar, Checkbox, IconButton, MenuItem, Modal,
    Icon, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Avatar, CircularProgress, Tooltip, Link, 
} from '@material-ui/core'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import Rating from '@material-ui/lab/Rating';
import { UserContext } from '../context/UserContext'
import 'date-fns';
import { Redirect } from "react-router-dom"
import Registration from './Registration'
import { firebaseGetAllUsers } from '../api/Firebase'
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

const TimesheetModal = ({ openModal, setOpenModal, handleCloseModal }) => {

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
            margin: theme.spacing(1)
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: theme.spacing(2),
            height: '60%',
            width: '80%'
        }
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
                    <IconButton onClick={() => {
                        setOpenModal(false)
                    }}>
                        <CancelRoundedIcon />
                    </IconButton>
                    <Typography variant='h6' color='primary'>Add a timesheet</Typography>
                    <form className={classes.form} onSubmit={e => console.log(e)}>
                        <div className={classes.client}>
                            <Typography variant='subtitle1' color='primary'>Choose your client</Typography>
                            <TextField
                                required
                                fullWidth
                                select
                                size='small'
                                label='Select a period'
                                // value={supportTime}
                                // onChange={e => setSupportTime(e.target.value)}
                                variant='outlined'
                                className={classes.margin}
                            >
                                {['Abdelmoneim Nafea', 'Islam Kahki'].map((client, i) => (
                                    <MenuItem key={i} value={client}>
                                        {client}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className={classes.jobTime}>
                            <Typography variant='subtitle1' color='primary'>Add the day you worked</Typography>
                            <TextField
                                required
                                fullWidth
                                select
                                size='small'
                                label='Select a period'
                                // value={supportTime}
                                // onChange={e => setSupportTime(e.target.value)}
                                variant='outlined'
                                className={classes.margin}
                            >
                                {['Abdelmoneim Nafea', 'Islam Kahki'].map((client, i) => (
                                    <MenuItem key={i} value={client}>
                                        {client}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div className={classes.buttons}>
                            <Button variant='contained' color='primary' type='submit'>
                                Add
                            </Button>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    //clear all fields
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
        return { name, calories, fat, carbs, protein };
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
            width: '80%'
        },
      });

        const classes = useStyles();
      
        return (
          <TableContainer component={Paper} className={classes.table}>
            <Table  aria-label="customized table">
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
                  <StyledTableRow key={row.name}>
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

    const theme = useTheme()

    const { user } = useContext(UserContext)

    useEffect(() => {

        try {
           
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
            padding: theme.spacing(2)
        },
        margin: {
            margin: theme.spacing(1)
        },
        paper: {
            width: '80%', 
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
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

    const handleAddTimesheet = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        console.log('close modal')
    }

   
    if (!user) {
        return <Redirect to={'/signin'} />
    } else {
        if (!user.complete) {
            return <Registration history={history}/>
        } else {
            return (
                <div className={classes.root}>
                    <Paper className={classes.paper}>
                        <Typography variant='h6' color='primary'>Timesheets</Typography>
                        <IconButton onClick={handleAddTimesheet}>
                            <Icon color='primary' fontSize='large'>add_circle</Icon>
                        </IconButton>
                    </Paper>
                    <TimesheetTable />
                   
                    <TimesheetModal openModal={openModal} setOpenModal={setOpenModal} handleCloseModal={handleCloseModal}/>
                    
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
                </div>
            )
        }
    }
}
