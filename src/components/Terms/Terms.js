import React from 'react';
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

export default function Terms() {
  const useStyles = makeStyles(() => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
  }))

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h6">
        Terms
      </Typography>
    </div>
  );
}
