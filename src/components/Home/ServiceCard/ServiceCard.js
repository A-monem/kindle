import React from 'react';
import { Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import SVG from './Svg'

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
      <SVG name={title} />
      <div className={classes.columnCenter}>
        <Typography variant="subtitle1">{title}</Typography>
        <Typography style={{ marginTop: theme.spacing(2) }} align="center">{description}</Typography>
      </div>
    </div>
  );
}
