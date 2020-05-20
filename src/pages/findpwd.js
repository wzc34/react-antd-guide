/**
 * 忘记密码
 * Created by wangzc on 06/24/2019.
 */
import React from 'react'
import connectComponent from '@common/connectComponent'
import { Button, Form, Modal, message, Input, Row, Col } from 'antd'
import Countdown from '@components/Countdown'
import methods from '@common/methods'
import md5Util from '@common/md5'
let captchaCount = 0
const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
}
class Findpwd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            downTime: 0,
            captchaDisabled: false,
            account: '',
            captchaCountState: 0,
        };
    }

    formRef = React.createRef()

    componentDidMount() {
    }
    toLogin () {
        this.props.router.push('/login')
    }

    validateToNextPassword = (_, value) => {
        if (value && !methods.valpwd(value)) {
            return Promise.reject('密码设置6-20个字符包含字母与数字')
        }
        return Promise.resolve();
    }

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    // 验证手机号
    validateToPhone = (_, value) => {
        if (value && !methods.phoneRegular(value)) {
            return Promise.reject('手机号不正确')
        }
        return Promise.resolve()
    }
    // 获取验证码
    getCaptcha () {
        const phone = this.formRef.current.getFieldValue("phone")||''
        if (phone && methods.trim(phone).length > 0) {
            if (methods.phoneRegular(phone)) {
                this.doCheckPhone(phone)
            } else {
                message.error(`手机号不正确`)
            }
        } else {
            message.error(`请输入手机号`)
        }
    }
    // 检查验证码
    validateCaptchaBlur = async (_, value) => {
        const phone = this.formRef.current.getFieldValue('phone')
        if (value) {
            if (value.toString().length !== 6) {
                return Promise.reject('验证码输入错误')
            } else {
                const { actions } = this.props
                let data = null
                await actions.checkCaptcha({mobile: phone, captcha: value, resolved: (res) => {
                    data = res
                    }, rejected: (e) => {}
                })
                if (data === true) {
                    return Promise.resolve()
                } else {
                    return Promise.reject('验证码输入错误')
                }
            }
        } else {
            return Promise.resolve();
        }
    }
    // 验证手机是否已存在
    doCheckPhone(phone) {
        const { actions } = this.props
        actions.getUserInfo({phone,
            resolved: (res) => {
                if (res) {
                    captchaCount ++
                    this.setState({account: res, captchaDisabled: true, captchaCountState: captchaCount, downTime: Date.now() + 60 * 1000})
                    this.doActionCatpcha(phone)
                } else {
                    message.error(`手机号不存在，请输入正确的手机号`)
                }
            }, rejected: (e) => {
            }
        })
    }
    doActionCatpcha (phone) {
        const { actions } = this.props
        actions.doCaptcha({mobile: phone,
            resolved: (res) => {
                if(!res){
                    message.error(res.message)
                }
            }, rejected: (e) => {
                this.setState({captchaDisabled: false, downTime: 0 })
            }
        })
    }
    //倒计时完成后
    onComplete = () => {
        this.setState({ captchaDisabled: false, downTime: 0 })
    }

    handleSubmit = values => {
        this.updateUserInfo(values.password)
    }

    showConfirm() {
        const _this = this
        Modal.info({
            title: '提示',
            okText: '确定',
            content: (
              <div>
                <p>密码重置成功</p>
              </div>
            ),
            onOk() {
                _this.toLogin()
            },
          });
    }

    updateUserInfo (pwd) {
        const { actions} = this.props
        const user = {}
        user.id = this.state.account.id
        user.password = md5Util.md5(pwd)
        this.setState({loading: true})
        actions.updateUserInfo({user: user,
            resolved: (res) => {
                if (res && res > 0) {
                    this.setState({loading: false})
                    this.showConfirm()
                }
            }, rejected: (e) => {
                this.setState({loading: false})
            }
        })
    }

    render() {
        const { loading, downTime, captchaDisabled, captchaCountState } = this.state
        return (
            <div>
                <Row className="reg-header" type="flex" justify="space-between" align="middle">
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                <span className='ml-5 col-blue' style={{fontWeight:'bolder',fontSize:'20px'}}>XXX平台</span>
                        {/* <img alt='企融宝' src={require('@img/logo.png')} style={{height: '50px'}}/> */}
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10} className="reg-header-right">已有账号？<span onClick={()=>this.toLogin()}>请登录</span></Col>
                </Row>
                <Row type="flex" justify="center" style={{margin: '60px 0', fontSize: '20px'}}>
                    <Col>重置密码</Col>
                </Row>
                <Row type="flex" justify="center">
                    <Col xs={20} sm={20} md={10} lg={10} xl={10}>
                    <Form {...formItemLayout} ref={this.formRef} scrollToFirstError onFinish={this.handleSubmit}>
                            <Form.Item label="手机号" name="phone"
                                    rules={[{ required: true, message: '请输入手机号' },
                                    {
                                        validator: this.validateToPhone,
                                    },
                                ]} hasFeedback>
                                <Input allowClear placeholder="手机号" />
                            </Form.Item>
                            <Form.Item label="验证码">
                                <Row gutter={8}>
                                    <Col span={13}>
                                    <Form.Item name="captcha" noStyle
                                            rules={[
                                                { 
                                                    required: true, 
                                                    message: '请输入短信验证码' 
                                                },
                                                {
                                                    validator: this.validateCaptchaBlur,
                                                }
                                            ]}>
                                        <Input placeholder="短信验证码" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Button onClick={()=>this.getCaptcha()} disabled={captchaDisabled}>
                                            {captchaCountState > 0 && (
                                                <Countdown onComplete={this.onComplete} date={downTime} />
                                            )}
                                            {captchaCountState === 0 && (<span>获取验证码</span>)}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item label="新密码" name="password"
                                    rules={[
                                    {
                                        required: true,
                                        message: '请输入新密码',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                    ]} hasFeedback>
                                <Input.Password maxLength={20} allowClear placeholder="新密码" />
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                label="确认密码"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                {
                                    required: true,
                                    message: '请再次输入密码',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                        return Promise.reject('两次密码输入不一致');
                                    },
                                }),
                                ]}
                            >
                                <Input.Password allowClear placeholder="确认密码"/>
                            </Form.Item>
                            <Form.Item wrapperCol={{ xs: { span: 24},sm:{span: 14, offset: 7 }}}>
                                <Button type="primary" htmlType="submit" loading={loading} style={{width: '100%'}}>
                                    提交
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <div className="reg-footer">Copyright &copy; {new Date().getFullYear()}</div>
            </div>
        )
    }
}
const LayoutComponent = Findpwd;
function mapStateToProps(state) {
    return {
    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })