# react-antd-guide
最简单的react+antd项目

## 技术栈

react + redux + react-router + antd

## 运行项目
```npm install```

```npm run start```  
启动项目，默认开发环境

```npm run bulid```  
构建生产项目，将生产应用程序生成到“build”文件夹下，可在ngix中绑定域名，根目录为指向build文件夹下的index.html

### 目录结构

```assets 资源文件  
common 一些公用方法  
components 用户自定义组件  
pages js页面
<<<<<<< HEAD
<<<<<<< HEAD
redux 页面调用的action与service方法，异步调用
=======
redux 页面调用的action与service方法
>>>>>>> 9f97350... first commit
=======
redux 页面调用的action与service方法
>>>>>>> 6f41969e498af738b0a1b0955773a55aa8bf60de
router 页面的路由
config-overrides.js 静态资源配置
```
### 说明
1. 开发模式  
.env.development(默认)  
.env.production(生产模式)  
.env.test(自定义模式)   
<<<<<<< HEAD
<<<<<<< HEAD
文件的属性调用，如const api = process.env.REACT_APP_API  

2. 路由routes.js
=======
获取文件的属性方式，如const api = process.env.REACT_APP_API  

2. 出现TypeError: Failed to fetch，需要修改上述文件REACT_APP_API的值  

3. 路由routes.js
>>>>>>> 9f97350... first commit
=======
获取文件的属性方式，如const api = process.env.REACT_APP_API  

2. 出现TypeError: Failed to fetch，需要修改上述文件REACT_APP_API的值  

3. 路由routes.js
>>>>>>> 6f41969e498af738b0a1b0955773a55aa8bf60de
```
...
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

...

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

```

###### 引用
>记录，成为更好的自己，为此而奋斗
