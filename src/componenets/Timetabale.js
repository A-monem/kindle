import React, {useState, useEffect} from 'react';
import { Typography, CircularProgress } from '@material-ui/core'
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
        firebaseGetTimetable()
            .then((fetchedTimetable) => {
                let onceOffTimetable = fetchedTimetable['Once off'].reduce((combiner, job) => (
                    combiner.concat(job.time.map((time) => (
                        {
                            startDate: new Date(time.startDate),
                            endDate: new Date(time.endDate),
                            title: job.name
                        }
                    )))
                ), [])
                
                let ongoingTimetable = fetchedTimetable['Ongoing'].reduce((combiner, job) => {
                    const today = new Date(Date.now())
                    let jobHolder = []
                    
                    job.time.forEach((time) => {
                        
                        const startDate = new Date(time.startDate)
                        const endDate = new Date(time.endDate)
                        const day = startDate.getDay()
                        const startHours = startDate.getHours()
                        console.log(startHours)
                        const startMinutes = startDate.getMinutes()
                        const endHours = endDate.getHours()
                        const endMinutes = endDate.getMinutes()
                        
                    
                            
                            let newStartDate = new Date(today)
                            newStartDate.setDate(today.getDay() > day ? (today.getDate() - (today.getDay() - day)) : (today.getDate() - (day - today.getDay())))
                            newStartDate.setHours(startHours)
                            newStartDate.setMinutes(startMinutes)
                            
                            let newEndDate = new Date(newStartDate)
                            newEndDate.setHours(endHours)
                            newEndDate.setMinutes(endMinutes)
                            
                            jobHolder.push({
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: job.name 
                            })

                    })
                    
                    return(combiner.concat(jobHolder))
                }, [])

                console.log(ongoingTimetable)

                setTimetable(onceOffTimetable.concat(ongoingTimetable))
            })
            .catch((error) => console.log(error))
    }, [])

    const theme = useTheme()
    const today = new Date()

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: timetable ? 'flex-start' : 'center',
            alignItems: 'center',
            //height: '50%',
            //width: '50%'
            
        },
    }))

    const classes = useStyles()

    // const schedulerData = [
    //     {
    //       startDate: "2020-10-06T09:00",
    //       endDate: "2020-10-06T11:00",
    //       title: "Meeting"
    //     },
    //     {
    //       startDate: "2020-10-07T12:00",
    //       endDate: "2020-10-07T13:30",
    //       title: "Go to a gym"
    //     },
    //     {
    //       startDate: "2020-10-08T00:00",
    //       endDate: "2020-10-08T23:59",
    //       title: "New"
    //     }
    //   ]

    const appointments = [{
    //     title: 'Website Re-Design Plan',
    //     startDate: new Date(2020, 11, 18, 9, 35),
    //     endDate: new Date(2020, 11, 18, 11, 30),
    //     id: 0,
    //     rRule: 'FREQ=DAILY;COUNT=3',
    //     exDate: '20180628T063500Z,20180626T063500Z',
    //   }, {
    //     title: 'Book Flights to San Fran for Sales Trip',
    //     startDate: new Date(2020, 11, 18, 9, 35),
    //     endDate: new Date(2020, 11, 18, 11, 30),
    //     id: 1,
    //     rRule: 'FREQ=DAILY;COUNT=4',
    //     exDate: '20180627T091100Z',
    //   }, {
        title: 'Install New Router in Dev Room',
        startDate: new Date(2020, 11, 18, 9, 35),
        endDate: new Date(2020, 11, 18, 11, 30),
        id: 2,
        rRule: 'FREQ=DAILY;COUNT=5',
      }];


    return (
        <div className={classes.root}>
            <Typography variant="h6" >
                Timetable
            </Typography>
            {
                timetable 
                ? (
                    
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
                                cellDuration={120}
                            />
                            
                            <Toolbar />
                            <ViewSwitcher />
                            <Appointments />
                            <AppointmentTooltip />
                        </Scheduler>
                
                )
                : <CircularProgress color='secondary'/>
            }
        </div>
    );
}