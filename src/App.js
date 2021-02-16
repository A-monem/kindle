import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AppbarWithRouter from './componenets/Appbar'
import Home from './componenets/Home'
import Error from './componenets/Error'
import Signup from './componenets/Signup'
import Signin from './componenets/Signin'
import Dashboard from './componenets/Dashboard'
import JobBoard from './componenets/JobBoard'
import Messages from './componenets/Messages'
import Search from './componenets/Search'
import Terms from './componenets/Terms'
import Privacy from './componenets/Privacy'
import Profile from './componenets/Profile'
import Timesheets from './componenets/Timesheets'
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
