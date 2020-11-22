import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext'
import Registration from './Registration'
import { Redirect } from "react-router-dom"
import ClientJobBoard from './ClientJobBoard/ClientJobBoard'
import WorkerJobBoard from './WorkerJobBoard/WorkerJobBoard'
import { strings } from '../constants'

export default function JobBoard({ history }) {

    const { user } = useContext(UserContext)

    if (!user) {
        return <Redirect to={strings.signin_url} />
    } else {
        if (!user.complete) {
            return <Registration history={history}/>
        } else if (user.type === strings.client) {
            return <ClientJobBoard />
        } else if (user.type === strings.worker) {
            return <WorkerJobBoard />
        }
    }
}

