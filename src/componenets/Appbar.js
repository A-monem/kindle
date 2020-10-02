import React, { useContext, useState, useEffect} from 'react'
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Button } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { UserContext } from '../context/UserContext'
import { ThemeContext } from '../context/ThemeContext'
import AccountCircle from '@material-ui/icons/AccountCircle';
import DarkModeToggle from "react-dark-mode-toggle";
import { withRouter } from "react-router";
import { firebaseLogout } from '../api/Firebase'

export function Appbar({ history }) {
    const theme = useTheme()
    const { user, addUser } = useContext(UserContext)
    const { darkMode, toggleTheme } = useContext(ThemeContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleSignOut = () => {
        firebaseLogout()
        .then(() => {
            addUser(null)
            setAnchorEl(null)
            history.replace('./')
        })
        .catch(function(error) {
            console.log(error)
        });
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
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => console.log("icon clicked")}>
                        <img src={require('../images/logo.png')} alt={'logo'} className={classes.logo} id='navbarLogo'/>
                    </IconButton>
                    <Button color="primary" onClick={() => history.replace('/')}>Kindle</Button>
                </div>
                <DarkModeToggle
                    onChange={toggleTheme}
                    checked={darkMode}
                    size={60}
                />
                {user
                    ?
                    <>
                        <Typography className={classes.margin}>{user.firstName} {user.lastName}</Typography>
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
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                        </Menu>
                    </>
                    :
                    <>
                        <Button variant="outlined" size="small" className={classes.margin} 
                        style={{textTransform: "none"}}
                        onClick={() => history.push('/signin')}>
                            Sign in
                        </Button>
                        <Button variant="outlined" size="small" 
                            className={classes.margin} style={{textTransform: "none"}}
                            onClick={() => history.push('/signup')}>
                            Sign up
                        </Button>
                    </>
                }
            </Toolbar>
        </AppBar>
    )
}

export const AppbarWithRouter = withRouter(Appbar)