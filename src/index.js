/*
 * @Description: 添加antd组件显示中文
 * @Autor: wangzc
 * @Date: 2020-03-09 23:18:18
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-27 17:15:50
 */ 
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import routes from './router/routes'
import store from "@redux/store/configureStore"
import registerServiceWorker from './registerServiceWorker'
import '@css/style.css'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

ReactDOM.render((
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            {routes}
        </ConfigProvider>
    </Provider>
), document.getElementById("root"));

registerServiceWorker()