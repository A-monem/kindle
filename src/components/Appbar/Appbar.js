import React, { useContext, useState } from 'react'
import {
  AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Button, Badge, useMediaQuery,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle';
import DarkModeToggle from 'react-dark-mode-toggle';
import { withRouter } from 'react-router';
import MenuIcon from '@material-ui/icons/Menu'
import { ThemeContext } from '../../context/ThemeContext'
import { UserContext } from '../../context/UserContext'
import { firebaseLogout, auth } from '../../api/Firebase'
import { strings } from '../../constants'

const UserMenu = ({
  history, location, removeMessageBadge, setRemoveMessageBadge,
}) => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <>
      {matches && (
      <div style={{ marginLeft: theme.spacing(4), display: 'inline' }}>
        <Button color="primary" size="small" style={{ marginLeft: theme.spacing(2) }} onClick={() => history.replace(strings.dashboard_url)}>Dashboard</Button>
        <Button color="primary" size="small" style={{ marginLeft: theme.spacing(2) }} onClick={() => history.replace(strings.search_url)}>Search</Button>
        <Button color="primary" size="small" style={{ marginLeft: theme.spacing(2) }} onClick={() => history.replace(strings.timesheets_url)}>Timesheet</Button>
        <Button color="primary" size="small" style={{ marginLeft: theme.spacing(2) }} onClick={() => history.replace(strings.jobs_url)}>Job Board</Button>
        <Button
          color="primary"
          size="small"
          style={{ marginLeft: theme.spacing(2) }}
          onClick={() => {
            setRemoveMessageBadge(true)
            history.replace(strings.messages_url)
          }}
        >
          <Badge color="secondary" variant="dot" invisible={removeMessageBadge || location.pathname === strings.messages_url}>Messages</Badge>
        </Button>
      </div>
      )}
    </>
  )
}
const UserSubMenu = ({
  user, handleMenu, anchorEl, isMenuOpen, handleClose, handleProfile, handleSignOut,
}) => {
  const theme = useTheme()
  const useStyles = makeStyles(() => ({
    appBar: {
      color: theme.palette.primary.main,
      background: 'transparent',
    },
    logo: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    title: {
      flexGrow: 1,
    },
    margin: {
      marginLeft: theme.spacing(1),
    },
  }))
  const classes = useStyles()

  return (
    <>
      <Typography variant="subtitle2" className={classes.margin}>
        {user.firstName}
        {' '}
        {user.lastName}
      </Typography>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMenuOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </Menu>
    </>
  )
}
const SignMenu = ({ history }) => {
  const theme = useTheme()
  const useStyles = makeStyles(() => ({
    appBar: {
      color: theme.palette.primary.main,
      background: 'transparent',
    },
    logo: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    title: {
      flexGrow: 1,
    },
    margin: {
      marginLeft: theme.spacing(1),
    },
  }))
  const classes = useStyles()

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        color="secondary"
        className={classes.margin}
        style={{ textTransform: 'none' }}
        onClick={() => history.push(strings.signin_url)}
      >
        Sign in
      </Button>
      <Button
        variant="outlined"
        size="small"
        color="secondary"
        className={classes.margin}
        style={{ textTransform: 'none' }}
        onClick={() => history.push(strings.signup_url)}
      >
        Sign up
      </Button>
    </>
  )
}

function Appbar({ history, location }) {
  const {
    user, addUser, removeMessageBadge, setRemoveMessageBadge,
  } = useContext(UserContext)
  const theme = useTheme()
  const { darkMode, toggleTheme } = useContext(ThemeContext)
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const matches = useMediaQuery(theme.breakpoints.up('lg'))
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = () => {
    try {
      firebaseLogout()
        .then(() => {
          addUser(null)
          setAnchorEl(null)
          history.replace(strings.home_url)
        })
        .catch((error) => {
          console.log(error)
        })
    } catch (error) {
      console.log(error)
    }
  }
  const handleProfile = () => {
    history.push(`/profile/${auth.currentUser.uid}`)
    setAnchorEl(null)
  }
  const useStyles = makeStyles(() => ({
    appBar: {
      color: theme.palette.primary.main,
      background: 'transparent',
    },
    logo: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
    title: {
      flexGrow: 1,
    },
    margin: {
      marginLeft: theme.spacing(1),
    },
  }))
  const classes = useStyles()

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <div className={classes.title}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => history.replace(strings.home_url)}>
            <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" className={classes.logo} id="navbarLogo" />
          </IconButton>
          <Typography color="primary" style={{ display: 'inline' }}>Kindle</Typography>
          { user ? (
            <UserMenu
              history={history}
              location={location}
              removeMessageBadge={removeMessageBadge}
              setRemoveMessageBadge={setRemoveMessageBadge}
            />
          ) : null}
        </div>
        {matches && (
          <DarkModeToggle
            onChange={toggleTheme}
            checked={darkMode}
            size={60}
          />
        )}
        { user ? (
          <>
            {matches ? (
              <UserSubMenu
                user={user}
                handleMenu={handleMenu}
                anchorEl={anchorEl}
                isMenuOpen={isMenuOpen}
                handleClose={handleClose}
                handleProfile={handleProfile}
                handleSignOut={handleSignOut}
              />
            ) : (
              <>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={isMenuOpen}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => {
                    history.replace(strings.dashboard_url)
                    handleClose()
                  }}
                  >
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={() => {
                    history.replace(strings.search_url)
                    handleClose()
                  }}
                  >
                    Search
                  </MenuItem>
                  <MenuItem onClick={() => {
                    history.replace(strings.timesheets_url)
                    handleClose()
                  }}
                  >
                    Timesheet
                  </MenuItem>
                  <MenuItem onClick={() => {
                    history.replace(strings.jobs_url)
                    handleClose()
                  }}
                  >
                    Job Board
                  </MenuItem>
                  <MenuItem onClick={() => {
                    history.replace(strings.messages_url)
                    handleClose()
                  }}
                  >
                    Messages
                  </MenuItem>
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </>
            )}
          </>
        ) : <SignMenu history={history} />}
      </Toolbar>
    </AppBar>
  )
}

export default withRouter(Appbar)
