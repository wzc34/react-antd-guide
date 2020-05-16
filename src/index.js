/**
 * Created by Daguang Li on 11/24/2017.
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import routes from './router/routes'
import store from "@redux/store/configureStore"
import registerServiceWorker from './registerServiceWorker'
import '@fonts/font-awesome.min.css'
import '@css/style.css'

ReactDOM.render((
    <Provider store={store}>
        {routes}
    </Provider>
), document.getElementById("root"));

registerServiceWorker()