import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import Registration from '../Registration'
import ClientJobBoard from './ClientJobBoard'
import WorkerJobBoard from './WorkerJobBoard'
import { strings } from '../../constants'

export default function JobBoard({ history }) {
  const { user } = useContext(UserContext)

  if (!user) {
    return <Redirect to={strings.signin_url} />
  }

  if (!user.complete) {
    return <Registration history={history} />
  }

  if (user.type === strings.client) {
    return <ClientJobBoard />
  }

  if (user.type === strings.worker) {
    return <WorkerJobBoard />
  }
}
