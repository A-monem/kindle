import React, {useState, useEffect} from 'react';
import { Button, TextField, FormControlLabel, Checkbox, Link, Paper, Box, Grid, Typography, 
    Switch, CircularProgress } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseGetTimetable, firebaseSetTimetable, firebaseAddEventToTimetable} from '../api/Firebase'
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, DayView, Appointments, WeekView, AppointmentTooltip, ViewSwitcher, Toolbar} from '@devexpress/dx-react-scheduler-material-ui';
import {  MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';

export default function Timetable({ history }){
    const [timetable, setTimetable] = useState(null)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [title, setTitle] = useState('')

    useEffect(() => {
        firebaseSetTimetable(schedulerData)
        .then(() => {
            firebaseGetTimetable()
            .then((timetable) => {
                //console.log(timetable)
                setTimetable(timetable)
            })
            .catch((error) => console.log(error))
        })
        .catch((error) => console.log(error))
        
    }, [])

    const theme = useTheme()

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
    }))

    const classes = useStyles()

    const schedulerData = [
        {
          startDate: "2020-10-06T09:00",
          endDate: "2020-10-06T11:00",
          title: "Meeting"
        },
        {
          startDate: "2020-10-07T12:00",
          endDate: "2020-10-07T13:30",
          title: "Go to a gym"
        },
        {
          startDate: "2020-10-08T00:00",
          endDate: "2020-10-08T23:59",
          title: "New"
        }
      ]

      const today = new Date()

    return (
        <div className={classes.root}>
            <Typography variant="h6" >
                Timetable
            </Typography>
            {/* <TextField
                id="startDate"
                label="start date"
                type="datetime-local"
                defaultValue="2020-10-07T00:00"
                onChange={(date) => setStartDate(date.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                id="endDate"
                label="end date"
                type="datetime-local"
                defaultValue="2020-10-07T12:00"
                onChange={(date) => setEndDate(date.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                size='small'
                variant='outlined'
                margin='normal'
                required
                id='title'
                label='title'
                name='postalCode'
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
            <Button
                variant='contained'
                color='primary'
                size='small'
                onClick={() =>{
                    console.log(startDate)
                    console.log(endDate)
                    firebaseAddEventToTimetable({
                        startDate, 
                        endDate,
                        title
                    }).then((timetable) => setTimetable(timetable))
                } 
                } 
            >
                Add Event
                </Button> */}
            {
                timetable 
                ? (
                    <Paper>
                        <Scheduler
                            data={timetable}
                        >
                             <ViewState
                                defaultCurrentDate={today}
                                defaultCurrentViewName="Day"
                            />
                            <DayView
                                startDayHour={0}
                                endDayHour={23}
                                cellDuration={120}
                            />
                            <WeekView
                                startDayHour={0}
                                endDayHour={23}
                                cellDuration={60}
                                
                            />
                            <Toolbar />
                            <ViewSwitcher />
                            <Appointments />
                            <AppointmentTooltip />
                        </Scheduler>
                    </Paper>
                )
                : <CircularProgress />
            }   
            
        </div>
    );
}