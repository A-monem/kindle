import React, { useState, useContext } from 'react';
import {
    Button, Typography, Paper, TextField, Snackbar, IconButton, MenuItem,
    Icon, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert';
import { UserContext } from '../context/UserContext'
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import moment from 'moment'
import { firebaseSendOffer, auth} from '../api/Firebase'
import { arrays, strings } from '../constants'


export default function ApplyJob({ job, setOpenApplyModal }) {

    const [openError, setOpenError] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [message, setMessage] = useState('')
    const [rate, setRate] = useState('')
    const [particularSupportTime, setParticularSupportTime] = useState([])
    const [daySelected, setDaySelected] = useState('')
    const [dateSelected, setDateSelected] = useState(new Date())
    const [fromTime, setFromTime] = useState(new Date())
    const [toTime, setToTime] = useState(new Date())
    const days = arrays.days

    const theme = useTheme()
    const { user } = useContext(UserContext)

    const useStyles = makeStyles(() => ({
        root: {
            width: '100%',
            height: '100%'
        },
        margin: {
            margin: theme.spacing(1)
        },
        modal: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
        modalPaper: {
            width: '60%',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            padding: theme.spacing(2)
        },
        modlaJobDetailsRow:{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%', 
            marginTop: theme.spacing(2)
        },
        particularDaysSelect: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%', 
            marginTop: theme.spacing(2)
        },
        buttons: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
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

    const handleAddParticularDayTime = () => {
        
        if (daySelected && fromTime && toTime) {
            
            const arr = [...particularSupportTime]
            
            arr.push({
                day: daySelected,
                from: fromTime.getTime(),
                to: toTime.getTime()
            })

            setParticularSupportTime(arr)
            setDaySelected('')
            setFromTime(new Date())
            setToTime(new Date())

        } else if (dateSelected && fromTime && toTime)   {
            
            const arr = [...particularSupportTime]

            console.log(fromTime.setDate(dateSelected.getDate()))
            
            arr.push({
                day: dateSelected.getTime(),
                from: fromTime.setDate(dateSelected.getDate()),
                to: toTime.setDate(dateSelected.getDate())
            })

            setParticularSupportTime(arr)
            setDateSelected(new Date())
            setFromTime(new Date())
            setToTime(new Date())

        } else {
            setMessage(strings.applyjob_error)
            setOpenError(true)
        }
    }

    const handleDeleteParticularDayTime = (row) => {
        const arr = particularSupportTime.filter(item => {
            if (item.day === row.day && item.time === row.time) {
                return false
            } else {
                return true
            }
        })

        setParticularSupportTime(arr)
    }

    const handleApply = () => {

        if (rate && fromTime && toTime){
            if (daySelected || dateSelected){
                
                const offer = {
                    name: `${user.firstName} ${user.lastName}`,
                    avatar: user.avatar,
                    rate, 
                    particularSupportTime,
                    status: strings.pending, 
                    workerId: auth.currentUser.uid
                }

                try{
                    firebaseSendOffer(job.jobId, offer)
                        .then(() => {
                            setMessage('Offer sent')
                            setOpenSuccess(true)
                            setOpenApplyModal(false)
                        })
                        .catch((error) => {
                            setMessage(strings.offer_send_error)
                            setOpenError(true)
                        })

                } catch (error) {

                }
                
            }
        }
    }

    return (
        <>
            <div className={classes.modal}>
                <Paper className={classes.modalPaper}>
                    <Typography variant='h6' color='primary'>Apply for a job</Typography>
                    {job
                        ? <>
                            <div style={{width: '100%'}}>
                                <div className={classes.modlaJobDetailsRow}>
                                    <Typography variant='subtitle2' ><span style={{ color: theme.palette.primary.main }}>Job title:</span> {job.title}</Typography>
                                    <Typography variant='subtitle2' ><span style={{ color: theme.palette.primary.main }}>Location:</span> {job.address}</Typography>
                                </div>
                               <div className={classes.modlaJobDetailsRow}>
                                    <Typography variant='subtitle2' ><span style={{ color: theme.palette.primary.main }}>Client name:</span> {job.name}</Typography>
                                    <Typography variant='subtitle2' ><span style={{ color: theme.palette.primary.main }}>Job type:</span> {job.jobType}</Typography>
                               </div>
                                
                            </div>
                            <TextField
                                style={{width: '50%', marginTop: theme.spacing(3)}}
                                required
                                size='small'
                                variant='outlined'
                                margin='normal'
                                label='Hourly rate $'
                                value={rate}
                                placeholder='30'
                                onChange={e => setRate(e.target.value)}
                            />
                            <div className={classes.particularDaysSelect}>
                                {job.jobType === 'Ongoing'
                                    ? <TextField
                                        style={{ width: theme.spacing(25) }}
                                        select
                                        size='small'
                                        label='Select a day'
                                        value={daySelected}
                                        onChange={e => setDaySelected(e.target.value)}
                                        variant='outlined'
                                    >
                                        {days.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    : <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            id="date-picker-dialog"
                                            label="Select date"
                                            style={{ width: theme.spacing(25) }}
                                            format="dd/MM/yyyy"
                                            value={dateSelected}
                                            onChange={date => setDateSelected(date)}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                }
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardTimePicker
                                        id="time-picker"
                                        label="From"
                                        style={{ width: theme.spacing(25) }}
                                        value={fromTime}
                                        onChange={date => setFromTime(date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                    <KeyboardTimePicker
                                        id="time-picker"
                                        label="To"
                                        style={{ width: theme.spacing(25) }}
                                        value={toTime}
                                        onChange={date => setToTime(date)}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                                <IconButton onClick={handleAddParticularDayTime}>
                                    <Icon color='primary' fontSize='large'>add_circle</Icon>
                                </IconButton>
                            </div>
                            <div style={{ width: '100%' }}>
                                <TableContainer component={Paper} className={classes.margin}>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Day</TableCell>
                                                <TableCell>From</TableCell>
                                                <TableCell>To</TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {particularSupportTime.map((row, i) => (
                                                <TableRow key={i}>
                                                    <TableCell component="th" scope="row">
                                                        {job.jobType === 'Ongoing'
                                                            ? row.day
                                                            : moment(row.day).format('L')
                                                        }
                                                    </TableCell>
                                                    <TableCell>{moment(row.from).format('LT')}</TableCell>
                                                    <TableCell>{moment(row.to).format('LT')}</TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleDeleteParticularDayTime(row)}>
                                                            <DeleteForeverIcon color='primary' />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </>
                        : null
                    }
                    <div className={classes.buttons}>
                        <Button 
                            variant='outlined' 
                            color='secondary'
                            size='small'
                            onClick={handleApply}
                            style={{marginRight: theme.spacing(2)}}
                        >
                            Apply
                        </Button>
                        <Button 
                            variant='outlined' 
                            color='secondary'
                            size='small'
                            onClick={() => setOpenApplyModal(false)} 
                        >
                            Cancel
                        </Button>
                    </div>
                </Paper>
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
        </>
    );
}