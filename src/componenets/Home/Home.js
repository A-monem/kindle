/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Typography, Grid, Button, useMediaQuery, Box, Link,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { strings } from '../../constants'
import ServiceCard from './ServiceCard'
import HowItWorksCard from './HowItWorksCard'

export default function Home() {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('lg'))
  const useStyles = makeStyles(() => ({
    root: {
      height: '100%',
      width: '100%',
    },
    header: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
    },
    videoContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    video: {
      minWidth: '100%',
      minHeight: '100%',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      objectFit: 'cover',
    },
    content: {
      zIndex: 2,
    },
    columnCenter: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    columnStart: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',
      padding: theme.spacing(0),
      [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(2),
      },
    },
    columnEnd: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    services: {
      backgroundColor: theme.palette.secondary.light,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerImage: {
      width: theme.spacing(35),
      height: theme.spacing(35),
      [theme.breakpoints.down('lg')]: {
        width: theme.spacing(30),
        height: theme.spacing(30),
      },
      [theme.breakpoints.down('sm')]: {
        width: theme.spacing(25),
        height: theme.spacing(25),
      },
      [theme.breakpoints.down('xs')]: {
        width: theme.spacing(20),
        height: theme.spacing(20),
      },
    },
    footer: {
      backgroundColor: theme.palette.secondary.light,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: theme.spacing(10),
      [theme.breakpoints.down('lg')]: {
        paddingTop: theme.spacing(2),
      },
      paddingBottom: theme.spacing(10),
      [theme.breakpoints.down('lg')]: {
        paddingBottom: theme.spacing(2),
      },
    },
  }))
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {/* header */}
      <div className={classes.header}>
        <div className={classes.videoContainer}>
          <video className={classes.video} src={`${process.env.PUBLIC_URL}/videos/Kindle_promo.mp4`} type="video/mp4" autoPlay muted loop />
        </div>
        <div className={classes.content}>
          <Typography variant="h2" color="primary" style={{ fontFamily: 'Pacifico' }}>{strings.home_header_1}</Typography>
          <Typography variant="h2" color="primary" style={{ fontFamily: 'Pacifico', marginTop: theme.spacing(3) }}>{strings.home_header_2}</Typography>
          <Button
            variant="contained"
            style={{ marginTop: theme.spacing(4), padding: theme.spacing(2) }}
            onClick={() => console.log('Hello')}
          >
            Get Started
          </Button>
        </div>
      </div>
      {/* About Kindle */}
      <Box mt={15} className={classes.columnCenter}>
        <Typography variant="h4" color="primary" style={{ fontWeight: 'bold' }}>About Kindle</Typography>
        <Grid container style={{ height: '100%', marginTop: theme.spacing(10) }}>
          <Grid item xs={12} lg={6} className={classes.columnCenter}>
            <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" className={classes.headerImage} />
          </Grid>
          <Grid item xs={12} lg={4} className={classes.columnStart}>
            <Typography variant="body1" align="justify">{strings.about_kindle_1}</Typography>
            <Typography variant="body1" align="justify" style={{ marginTop: theme.spacing(2) }}>{strings.about_kindle_2}</Typography>
            <Typography variant="body1" align="justify" style={{ marginTop: theme.spacing(2) }}>{strings.about_kindle_3}</Typography>
          </Grid>
        </Grid>
      </Box>
      {/* Services */}
      <Box mt={15}>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '-10px ' }} viewBox="0 0 1440 320">
          <path fill={theme.palette.secondary.light} fillOpacity="1" d="M0,128L48,128C96,128,192,128,288,117.3C384,107,480,85,576,69.3C672,53,768,43,864,74.7C960,107,1056,181,1152,197.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
        <div className={classes.services}>
          <Typography variant="h4" color="primary" style={{ fontWeight: 'bold' }}>Services</Typography>
          <Grid spacing={3} style={{ marginTop: theme.spacing(10) }} container>
            <Grid item xs={false} lg={2} />
            <Grid item xs={12} lg={2} className={classes.columnCenter}>
              <ServiceCard title="Help around the house" description="Cleaning, yard maintenance, and home-office duties." />
            </Grid>
            <Grid item xs={12} lg={2} className={classes.columnCenter}>
              <ServiceCard title="Personal care" description="Showering, toileting and mealtime assistance at home or in the community." />
            </Grid>
            <Grid item xs={12} lg={2} className={classes.columnCenter}>
              <ServiceCard title="In-home care" description="Help with morning and evening routines, medical prompts, and meal preparation." />
            </Grid>
            <Grid item xs={12} lg={2} className={classes.columnCenter}>
              <ServiceCard title="Education and employment" description="Coaching to help you achieve your goals at school, college, or work." />
            </Grid>
            <Grid item xs={false} lg={2} />
          </Grid>
          <Grid spacing={3} style={{ marginTop: theme.spacing(10) }} container>
            <Grid item xs={false} lg={2} />
            <Grid item xs={12} lg={2} className={classes.columnCenter}>
              <ServiceCard title="Therapy support" description="Support to plan, practice, and enjoy your therapy." />
            </Grid>
            <Grid item xs={12} lg={2} className={classes.columnCenter}>
              <ServiceCard title="Out and about" description="Showering, toileting and mealtime assistance at home or in the community." />
            </Grid>
            <Grid item xs={12} lg={2} className={classes.columnCenter}>
              <ServiceCard title="Transport" description="Help to get your chores done or travel from A to B." />
            </Grid>
            <Grid item xs={12} lg={2} className={classes.columnCenter}>
              <ServiceCard title="Specialised" description="High needs support for more complex, personal requirements." />
            </Grid>
            <Grid item xs={false} lg={2} />
          </Grid>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill={theme.palette.secondary.light} fillOpacity="1" d="M0,128L40,133.3C80,139,160,149,240,154.7C320,160,400,160,480,149.3C560,139,640,117,720,96C800,75,880,53,960,85.3C1040,117,1120,203,1200,213.3C1280,224,1360,160,1400,128L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />
        </svg>
      </Box>
      {/* How it Works */}
      <Box mt={15} className={classes.columnCenter}>
        <Typography variant="h4" color="primary" style={{ fontWeight: 'bold' }}>How it works</Typography>
        <Grid spacing={10} style={{ marginTop: matches ? theme.spacing(10) : theme.spacing(2) }} container>
          <Grid item xs={false} lg={2} />
          <Grid item xs={12} lg={3} className={classes.columnCenter}>
            <HowItWorksCard
              title="Search for a support worker"
              description="Browse the profiles of Independent Support Workers in your area. They’ve all been checked and verified for your peace of mind. Narrow your search to particular interests, availability, skills and more."
            />
          </Grid>
          <Grid item xs={12} lg={3} className={classes.columnCenter}>
            <HowItWorksCard
              title="Book a support session"
              description="Shortlist your favourites then connect directly via the Mable platform. You and your new support worker or workers - can mutually agree upon the support services, price, time and location."
            />
          </Grid>
          <Grid item xs={12} lg={3} className={classes.columnCenter}>
            <HowItWorksCard title="Approve timesheet" description="Approve timesheets sent from support workers claiming jobs are done." />
          </Grid>
          <Grid item xs={false} lg={1} />
        </Grid>
      </Box>
      <Box mt={15} className={classes.footer}>
        <Grid spacing={3} container>
          <Grid item xs={false} lg={2} />
          <Grid item xs={12} lg={2} className={classes.columnStart}>
            <Link color="inherit" href="#">About</Link>
            <Link color="inherit" href="#" style={{ marginTop: theme.spacing(3) }}>Our Story</Link>
            <Link color="inherit" href="#" style={{ marginTop: theme.spacing(3) }}>Careers</Link>
          </Grid>
          <Grid item xs={12} lg={2} className={classes.columnStart}>
            <Link color="inherit" href="/signup">Join Kindle</Link>
            <Link color="inherit" href="/signup" style={{ marginTop: theme.spacing(3) }}>Find Support Worker</Link>
            <Link color="inherit" href="#" style={{ marginTop: theme.spacing(3) }}>Our Pricing</Link>
          </Grid>
          <Grid item xs={12} lg={2} className={classes.columnStart}>
            <Link color="inherit" href="/privacy">Privacy</Link>
            <Link color="inherit" href="/terms" style={{ marginTop: theme.spacing(3) }}>Terms and Conditions</Link>
            <Link color="inherit" href="#" style={{ marginTop: theme.spacing(3) }}>Community</Link>
            <Link color="inherit" href="#" style={{ marginTop: theme.spacing(3) }}>Events</Link>
          </Grid>
          <Grid item xs={12} lg={2} className={classes.columnStart}>
            <Link color="inherit" href="/signin">Login</Link>
            <Link color="inherit" href="/signup" style={{ marginTop: theme.spacing(3) }}>Register</Link>
          </Grid>
          <Grid item xs={false} lg={2} />
        </Grid>
        <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" className={classes.headerImage} />
        <Typography variant="h4" style={{ fontWeight: 'bold', marginTop: theme.spacing(5) }}>Kindle</Typography>
        <Typography variant="body2" align="center" style={{ marginTop: theme.spacing(5) }}>
          {'Copyright © '}
          <Link color="inherit" href="#">
            www.kindleDisabilityServices.com
          </Link>
          {' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Box>
    </div>
  );
}
