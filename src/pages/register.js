/**
 * 注册
 * Created by wangzc on 06/25/2019.
 */
import React from 'react'
import connectComponent from '@common/connectComponent';
import md5Util from '@common/md5'
import { Button, Input, Form, Row, Col, message, Steps, Result } from 'antd';
import methods from '@common/methods'
import Countdown from '@components/Countdown'
const { Step } = Steps
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
let captchaCount = 0

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            current: 1,
            downTime: 0,
            captchaDisabled: false,
            captchaCountState: 0,
        };
    }

    formRef = React.createRef()

    componentDidMount() {
    }

    toLogin() {
        this.props.router.push('/login')
    }
    //注册
    handleDoRegitster(user) {
        this.setState({ loading: true })
        const { actions } = this.props
        actions.doRegister({
            phone: user.phone, password: md5Util.md5(user.password), cnname: user.operator, company: null,
            resolved: (res) => {
                this.setState({ loading: false })
                if (res) {
                    this.setState({ current: 2 })
                } else {
                    message.error(res.message)
                }
            }, rejected: (e) => {
                this.setState({ loading: false })
            }
        })
    }
    validateToNextPassword = (_, value) => {
        if (value && !methods.valpwd(value)) {
            return Promise.reject('密码设置6-20个字符包含字母与数字')
        }
        return Promise.resolve();
    }

    handleSubmit = values => {
        this.handleDoRegitster(values)
    }

    // 验证手机号
    validateToPhone = (_, value) => {
        if (value && !methods.phoneRegular(value)) {
            return Promise.reject('手机号不正确')
        }
        return Promise.resolve()
    }
    // 获取验证码
    getCaptcha() {
        const phone = this.formRef.current.getFieldValue("phone") || ''
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
        actions.getUserInfo({
            phone,
            resolved: (res) => {
                // console.log('--res---', res)
                if (res) {
                    message.error(`该手机号已注册，请输入其它手机号`)
                } else {
                    captchaCount++
                    this.setState({ captchaDisabled: true, captchaCountState: captchaCount, downTime: Date.now() + 60 * 1000 })
                    this.doActionCatpcha(phone)
                }
            }, rejected: (e) => {

            }
        })
    }

    doActionCatpcha(phone) {
        const { actions } = this.props
        actions.doCaptcha({
            mobile: phone,
            resolved: (res) => {
                if (!res) {
                    message.error(res.message)
                }
            }, rejected: (e) => {
                this.setState({ captchaDisabled: false, downTime: 0 })
            }
        })
    }
    //倒计时完成后
    onComplete = () => {
        this.setState({ captchaDisabled: false, downTime: 0 })
    }


    render() {
        const { current, loading, captchaDisabled, downTime, captchaCountState } = this.state
        return (
            <div>
                <Row className="reg-header" type="flex" justify="space-between" align="middle">
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <span className='ml-5 col-blue' style={{fontWeight:'bolder',fontSize:'20px'}}>XXX平台</span>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10} className="reg-header-right">已有账号？<span onClick={() => this.toLogin()}>请登录</span></Col>
                </Row>
                <Row type="flex" justify="center" className="reg-main">
                    <Col xs={20} sm={20} md={10} lg={10} xl={10}>
                        <Steps size="small" current={current}>
                            <Step title="账号设置" />
                            <Step title="注册成功" />
                        </Steps>
                        <div className="steps-content">
                            {current === 1 && (
                                <Form {...formItemLayout} ref={this.formRef} scrollToFirstError onFinish={this.handleSubmit}>
                                    <Form.Item label="您的姓名" name="operator"
                                            rules={[{ required: true, message: '请输入您的姓名' },
                                            {
                                                max: 20,
                                                message: '姓名字数过长'
                                            }]} hasFeedback>
                                                <Input placeholder="姓名" />
                                    </Form.Item>
                                    <Form.Item label="您的手机号" name="phone"
                                            rules={[{ required: true, message: '请输入您的手机号' },
                                            {
                                                validator: this.validateToPhone,
                                            },
                                            ]} hasFeedback>
                                        <Input placeholder="手机号" />
                                    </Form.Item>
                                    <Form.Item label="验证码">
                                        <Row gutter={8}>
                                            <Col span={14}>
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
                                                    <Input allowClear placeholder="短信验证码" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Button onClick={() => this.getCaptcha()} disabled={captchaDisabled}>
                                                    {captchaCountState > 0 && (
                                                        <Countdown onComplete={this.onComplete} date={downTime} />
                                                    )}
                                                    {captchaCountState === 0 && (<span>获取验证码</span>)}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                    <Form.Item label="密码" name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入密码',
                                                },
                                                {
                                                    validator: this.validateToNextPassword,
                                                },
                                            ]} hasFeedback>
                                        <Input.Password placeholder="密码设置6-20个字符" />
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
                                    <Form.Item wrapperCol={{ xs: { span: 24 }, sm: { span: 14, offset: 7 } }}>
                                        {/* <Button className="mr-10" onClick={()=>this.handlePreChange()}>
                                            上一步
                                        </Button> */}
                                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                                            注册
                                        </Button>
                                    </Form.Item>
                                </Form>
                            )}
                            {current === 2 && (
                                <Result
                                    status="success"
                                    title="恭喜您，注册成功，请返回登录页开始操作"
                                    extra={[
                                        <Button type="primary" key="console" onClick={() => this.toLogin()}>
                                            去登录
                                  </Button>
                                    ]}
                                />
                            )}
                        </div>
                    </Col>
                </Row>
                <div className="reg-footer">Copyright &copy; {new Date().getFullYear()}</div>
            </div>
        )
    }
}
const LayoutComponent = Register;
function mapStateToProps(state) {
    return {
    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })