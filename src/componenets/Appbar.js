import React, { useContext, useState } from 'react'
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Typography, Button, Link} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { UserContext } from '../context/UserContext'
import { ThemeContext } from '../context/ThemeContext'
import AccountCircle from '@material-ui/icons/AccountCircle';
import DarkModeToggle from "react-dark-mode-toggle";
import { withRouter } from "react-router";

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
        // auth.signOut().then(() => {
        //     addUser(null)
        //     addTimetable(null)
        // }).catch(function(error) {
        //     console.log(error)
        // });
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
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => console.log("icon clicked")}>
                    <img src={require('../images/logo.png')} alt={'logo'} className={classes.logo} id='navbarLogo'/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    <Link href="/" onClick={() => history.push('/')} underline='none'>
                        Kindle
                    </Link>
                </Typography>
             
                <DarkModeToggle
                    onChange={toggleTheme}
                    checked={darkMode}
                    size={60}
                />
                {user
                    ?
                    <>
                        <Typography className={classes.margin}>Kindle</Typography>
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
                        <Button variant="outlined" size="small" className={classes.margin} style={{textTransform: "none"}}>
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