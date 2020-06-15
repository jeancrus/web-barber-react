import React from 'react';
import { Switch } from 'react-router-dom';
import Dashboard from '~/pages/Dashboard';
import SignIn from '~/pages/SignIn';
import Profile from '~/pages/Profile';
import Route from './Route';
import AdminPage from '~/pages/AdminPage';
import ScheduleList from '~/pages/ScheduleList';

export default function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={SignIn} />
            <Route path="/dashboard" component={Dashboard} isPrivate />
            <Route path="/profile" component={Profile} isPrivate />
            <Route path="/admin" component={AdminPage} isPrivate />
            <Route path="/schedule/:id" component={ScheduleList} isPrivate />

            <Route path="/" component={() => <h1>404</h1>} />
        </Switch>
    );
}
