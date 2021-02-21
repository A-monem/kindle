import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AppbarWithRouter from './components/Appbar'
import Home from './components/Home'
import Error from './components/Error/Error'
import Signup from './components/Signup'
import Signin from './components/Signin'
import Dashboard from './components/Dashboard'
import JobBoard from './components/JobBoard'
import Messages from './components/Messages'
import Search from './components/Search'
import Terms from './components/Terms'
import Privacy from './components/Privacy'
import Profile from './components/Profile'
import Timesheets from './components/Timesheets'
import CombinedContextProvider from './context/CombinedContext'
import ScrollToTop from './api/ScrollToTop'
import { strings } from './constants'
import PrivateRoute from './api/PrivateRoute'

function App() {
  const useStyles = makeStyles(() => ({
    app: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
  }))
  const classes = useStyles()

  return (
    <CombinedContextProvider>
      <CssBaseline />
      <Router>
        <ScrollToTop>
          <div className={classes.app} id="kindleApp">
            <AppbarWithRouter />
            <Switch>
              <Route path={strings.home_url} exact component={Home} />
              <Route path={strings.signup_url} exact component={Signup} />
              <Route path={strings.signin_url} exact component={Signin} />
              <PrivateRoute path={strings.dashboard_url} exact component={Dashboard} />
              <Route path={strings.jobs_url} exact component={JobBoard} />
              <Route path={strings.messages_url} exact component={Messages} />
              <Route path={strings.search_url} exact component={Search} />
              <Route path="/terms" exact component={Terms} />
              <Route path="/privacy" exact component={Privacy} />
              <Route path="/profile/:id" exact component={Profile} />
              <Route path={strings.timesheets_url} exact component={Timesheets} />
              <Route component={Error} />
            </Switch>
          </div>
        </ScrollToTop>
      </Router>
    </CombinedContextProvider>
  )
}

export default App
