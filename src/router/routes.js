/*
 * @Description: 
 * @Autor: wangzc
 * @Date: 2020-05-07 10:17:46
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-13 14:39:46
 */
import React from 'react'
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'
import App from '@pages/app'
import Login from '@pages/login'
import Register from '@pages/register'
import methods from '@common/methods'
import constants from '@common/constants';
import Index from '@pages/index'
import Personal from '@pages/setting/personal'
import Updatepwd from '@pages/setting/updatepwd'
import Updatephone from '@pages/setting/updatephone'
import Findpwd from '@pages/findpwd'
import NotifyList from '@pages/notify/list'

let hasRedirected = false

const onEnter = (nextState, replace) => {
    const account= methods.getLocalStorage(constants.localKey.accountInfo)
    if (!account && !hasRedirected) {
        hasRedirected = true
        replace({ pathname: '/login' })
    }
}
const onLogin = (nextState, replace) => {
    const account= methods.getLocalStorage(constants.localKey.accountInfo)
    if (account) {
        replace({ pathname: '/index' })
    }
}

const routes = (
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Index} onEnter={onEnter}/>
            <Route path="/index" component={Index} onEnter={onEnter}/>
            <Route path="/notify/list" component={NotifyList} onEnter={onEnter}/>
            <Route path="/setting/personal" component={Personal} onEnter={onEnter}/>
            <Route path="/setting/updatepwd" component={Updatepwd} onEnter={onEnter}/>
            <Route path="/setting/updatephone" component={Updatephone} onEnter={onEnter}/>
        </Route>
        <Route path="/login" component={Login} onEnter={onLogin}/>
        <Route path="/register" component={Register} onEnter={onLogin}/>
        <Route path="/findpwd" component={Findpwd} onEnter={onLogin}/>
        <Redirect from="*" to="/" />
    </Router>
);

export default routes;