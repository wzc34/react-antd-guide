/**
 * 登录
 * Created by wangzc on 02/20/2019.
 */
import React from 'react'
import connectComponent from '@common/connectComponent';
import constants from '@common/constants';
import { Button, Input, Row, Col, Form } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import methods from '@common/methods'
// import md5Util from '@common/md5'
import _ from 'lodash'
import '@css/login.css'

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            loading: false,
        };
    }
    componentDidMount() {
    }
    //登录
    doLogin(account, password){
        account = _.trim(account)
        password = _.trim(password)
        this.setState({ loading: true})
        // let { actions,router } = this.props
        if (account === '13100000000' && password === '123456') {
            methods.setLocalStorage(constants.localKey.accountInfo, JSON.stringify({ phone: 13100000000, password: '123456'}))
            this.props.router.router.push('/index')
        }
        // actions.doLogin({account, password:md5Util.md5(password),
        //     resolved: (res) => {
        //         this.setState({ loading: false})
        //         if(res){
        //             methods.setLocalStorage(constants.localKey.accountInfo, JSON.stringify(res.user))
        //             router.push('/index')
        //         }else {
        //             message.error(res.message)
        //         }
        //     }, rejected: (e) => {
        //         this.setState({ loading: false})
        //     }
        // })
    }
    toRegister () {
        this.props.router.push('/register')
    }

    toFindpwd () {
        this.props.router.push('/findpwd')
    }

    handleSubmit = values => {
        this.doLogin(values.account, values.password)
    }

    render() {
        const { loading } = this.state
        return (
            <div className="login-container">
                <img src={require('@img/bg/bg1.jpg')} alt="" className="sc-background" />

                <div className="top-content" style={{height: '100%'}}>
                        <div className="container">
                            <div className="row" >
                                <div className="col-sm-6 col-sm-offset-3">
                                    <div className="form-box">

                                        <Form scrollToFirstError onFinish={this.handleSubmit} className="login-form">
                                            <Form.Item>
                                                <div style={{fontSize:'20px', fontWeight:'bolder', marginTop: 15, textAlign: 'center', color: '#666'}}><span>XXX平台</span></div>
                                            </Form.Item>
                                            <Form.Item name="account"
                                                rules={[{ required: true, message: '请输入手机号' }]} hasFeedback>
                                                <Input
                                                    size="large" 
                                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    placeholder="手机号: 13100000000"
                                                />
                                            </Form.Item>
                                            <Form.Item name="password" rules={[{ required: true, message: '请输入密码'}]} hasFeedback>
                                                <Input
                                                    size="large" 
                                                    prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                                    type="password"
                                                    placeholder="密码: 123456"
                                                />
                                            </Form.Item>
                                            <Row type="flex" justify="end" style={{ color:'rgba(255,255,255,.7)', fontSize: '13px'}}>
                                                <Col style={{cursor: 'pointer'}} onClick={()=>this.toFindpwd()}>忘记密码？</Col>
                                            </Row>
                                            <Form.Item>
                                                <Button type="primary" size="large" loading={loading} htmlType="submit" className="login-form-button">登录</Button>
                                            </Form.Item>
                                            <Row type="flex" justify="center" style={{margin: '20px 0 0', color:'rgba(255,255,255,.7)', fontSize: '13px'}}>
                                                <Col style={{cursor: 'pointer'}} onClick={()=>this.toRegister()}>注册账号</Col>
                                            </Row>
                                        </Form>
                                    </div>
                                    <div className="login-footer">Copyright &copy; {new Date().getFullYear()}</div>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        )
    }
}
const LayoutComponent = Login;
function mapStateToProps(state) {
    return {
    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })