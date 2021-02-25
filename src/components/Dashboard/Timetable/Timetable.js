import React, { useState, useEffect } from 'react';
import { CircularProgress, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler, DayView, Appointments, WeekView, AppointmentTooltip, ViewSwitcher, Toolbar,
} from '@devexpress/dx-react-scheduler-material-ui';
import { firebaseGetTimetable } from '../../../api/Firebase'
import { strings } from '../../../constants'
import { useAlert } from '../../../context/AlertContext'

const SchedulerComponent = ({ today, timetable }) => (
  <Scheduler
    data={timetable}
  >
    <ViewState
      defaultCurrentDate={today}
      defaultCurrentViewName="Week"
    />
    <DayView
      startDayHour={0}
      endDayHour={23}
      cellDuration={120}// 120
    />
    <WeekView
      startDayHour={0}
      endDayHour={23}
      cellDuration={120}// 120
    />
    <Toolbar />
    <ViewSwitcher />
    <Appointments />
    <AppointmentTooltip />
  </Scheduler>
)

function Timetable() {
  const [timetable, setTimetable] = useState(null)

  const { showErrorAlert } = useAlert()

  useEffect(() => {
    try {
      firebaseGetTimetable()
        .then((fetchedTimetable) => {
          const onceOffTimetable = fetchedTimetable[strings.once].reduce((combiner, job) => (
            combiner.concat(job.time.map((time) => (
              {
                startDate: new Date(time.startDate),
                endDate: new Date(time.endDate),
                title: job.name,
              }
            )))
          ), [])

          const ongoingTimetable = fetchedTimetable[strings.ongoing].reduce((combiner, job) => {
            const today = new Date(Date.now())
            const jobHolder = []

            const dayTransform = {
              Monday: 1,
              Tueday: 2,
              Wednesday: 3,
              Thursday: 4,
              Friday: 5,
              Saturday: 6,
              Sunday: 7,
            }

            job.time.forEach((time) => {
              const startDate = new Date(time.startDate)
              const endDate = new Date(time.endDate)
              // const day = startDate.getDay()
              const day = dayTransform[time.day]
              const startHours = startDate.getHours()
              const startMinutes = startDate.getMinutes()
              const endHours = endDate.getHours()
              const endMinutes = endDate.getMinutes()

              const newStartDate = new Date(today)

              newStartDate.setDate(today.getDay() > day ? (today.getDate() - (today.getDay() - day)) : (today.getDate() - (day - today.getDay())))
              newStartDate.setHours(startHours)
              newStartDate.setMinutes(startMinutes)

              const newEndDate = new Date(newStartDate)

              newEndDate.setHours(endHours)
              newEndDate.setMinutes(endMinutes)

              jobHolder.push({
                startDate: newStartDate,
                endDate: newEndDate,
                title: job.name,
              })
            })

            return (combiner.concat(jobHolder))
          }, [])

          setTimetable(onceOffTimetable.concat(ongoingTimetable))
        })
        .catch((error) => {
          if (error.message) {
            showErrorAlert(error.message)
          } else {
            showErrorAlert('Error Loading timetable. Please checek your username and password')
          }
        })
    } catch (error) {
      if (error.message) {
        showErrorAlert(error.message)
      } else {
        showErrorAlert('Error loading timetable. Please checek your username and password')
      }
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
      height: 'calc(100vh - 64px)',
    },
  }))

  const classes = useStyles()

  return (
    <div className={classes.root}>
      {timetable
        ? <Paper className={classes.paper} elevation={3}><SchedulerComponent today={today} timetable={timetable} /></Paper>
        : <CircularProgress color="secondary" />}
    </div>
  );
}

export default Timetable
