import React from 'react';
import { Typography, Box } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Animation from './Animation'

export default function ServiceCard({ title, description }) {
  const theme = useTheme()

  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100%',
    },
    columnCenter: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }))

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Animation name={title} />
      <Box mt={5} className={classes.columnCenter}>
        <Typography variant="subtitle1" align="center">{title}</Typography>
        <Typography style={{ marginTop: theme.spacing(5), padding: theme.spacing(2) }} align="center">{description}</Typography>
      </Box>
    </div>
  );
}
