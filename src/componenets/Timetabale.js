import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Paper } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { firebaseGetTimetable } from '../api/Firebase'
import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, DayView, Appointments, WeekView, AppointmentTooltip, ViewSwitcher, Toolbar } from '@devexpress/dx-react-scheduler-material-ui';
import { strings } from '../constants'

const SchedulerComponent = ({ today, timetable }) => (
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

export default function Timetable() {
    const [timetable, setTimetable] = useState(null)

    const theme = useTheme()

    useEffect(() => {
        try {
            firebaseGetTimetable()
                .then((fetchedTimetable) => {
                    let onceOffTimetable = fetchedTimetable[strings.once].reduce((combiner, job) => (
                        combiner.concat(job.time.map((time) => (
                            {
                                startDate: new Date(time.startDate),
                                endDate: new Date(time.endDate),
                                title: job.name
                            }
                        )))
                    ), [])

                    let ongoingTimetable = fetchedTimetable[strings.ongoing].reduce((combiner, job) => {
                        const today = new Date(Date.now())
                        let jobHolder = []

                        job.time.forEach((time) => {

                            const startDate = new Date(time.startDate)
                            const endDate = new Date(time.endDate)
                            const day = startDate.getDay()
                            const startHours = startDate.getHours()
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

                        return (combiner.concat(jobHolder))
                    }, [])

                    setTimetable(onceOffTimetable.concat(ongoingTimetable))
                })
                .catch((error) => {
                    console.log(error)
                })

        } catch (error) {
            console.log(error)
        }
    }, [])

    const today = new Date()

    const useStyles = makeStyles(() => ({
        root: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: timetable ? 'flex-start' : 'center',
            alignItems: 'center',
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: theme.spacing(10),
            padding: theme.spacing(5),
            width: '80%',
            Height: '80%'
        }
    }))

    const classes = useStyles()

    return (
        <div className={classes.root}>
            {
                timetable
                    ? <Paper className={classes.paper} elevation={3}><SchedulerComponent today={today} timetable={timetable} /></Paper>
                    : <CircularProgress color='secondary' />
            }
        </div>
    );
}