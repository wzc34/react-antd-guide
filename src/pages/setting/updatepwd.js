/**
 * 修改密码
 * Created by wangzc on 06/24/2019.
 */
import React from 'react'
import CustomBreadcrumb from '@components/common/customBreadcrumb'
import connectComponent from '@common/connectComponent'
import { Card, Button, Form, Modal, message, Input, Row, Col } from 'antd'
import constants from '@common/constants';
import Countdown from '@components/Countdown'
import methods from '@common/methods'
import md5Util from '@common/md5'
const { confirm } = Modal
let captchaCount = 0
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6},
}
class Updatepwd extends React.Component {
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
        const account = JSON.parse(methods.getLocalStorage(constants.localKey.accountInfo))
        this.setState({account})
    }
    
    validateToNextPassword = (rule, value) => {
        if (value && !methods.valpwd(value)) {
            return Promise.reject('密码设置6-20个字符包含字母与数字')
        }
        return Promise.resolve();
    }

    // 检查验证码
    validateCaptchaBlur = async (rule, value) => {
        const phone = this.state.account.phone
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
            return Promise.resolve()
        }
    }

    // 获取验证码
    getCaptcha () {
        const phone = this.state.account.phone
        captchaCount ++
        this.setState({captchaDisabled: true, captchaCountState: captchaCount, downTime: Date.now() + 60 * 1000})
        this.doActionCatpcha(phone)
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
        this.showConfirm(values.password)
    }

    showConfirm(pwd) {
        const _this = this
        confirm({
          title: '提示',
          content: '修改密码后将重新登录，确定修改吗？',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            _this.updateUserInfo(pwd)
          },
          onCancel() {
            // console.log('Cancel');
          },
        });
    }

    updateUserInfo (pwd) {
        const { actions } = this.props
        const { account } = this.state
        const user = {}
        user.id = account.id
        user.password = md5Util.md5(pwd)
        this.setState({loading: true})
        actions.updateUserInfo({user: user,
            resolved: (res) => {
                if (res && res > 0) {
                    message.success(`修改成功`)
                    actions.doLogout({
                        account: account.phone,
                        resolved: (res) => {
                          this.props.router.push('/login')
                        }, rejected: (e) => {}
                    })  
                    this.setState({loading: false})
                }
            }, rejected: (e) => {
                this.setState({loading: false})
            }
        })
    }

    render() {
        const { loading, downTime, captchaDisabled, account, captchaCountState } = this.state
        return (
            <div className="container">
                <CustomBreadcrumb arr={['设置','修改密码']}/>
                <Card title="修改密码" bordered={false}>
                    <Form {...formItemLayout} ref={this.formRef} scrollToFirstError onFinish={this.handleSubmit}>
                        <Form.Item label="手机号">
                            <Row gutter={8} align="middle">
                                <Col span={10}>
                                {account.phone}
                                </Col>
                                <Col span={10}>
                                    <Button onClick={()=>this.getCaptcha()} disabled={captchaDisabled}>
                                        {captchaCountState > 0 && (
                                            <Countdown onComplete={this.onComplete} date={downTime} />
                                        )}
                                        {captchaCountState === 0 && (<span>获取验证码</span>)}
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item label="验证码" name="captcha"
                                rules={[
                                    { 
                                        required: true, 
                                        message: '请输入短信验证码' 
                                    },
                                    {
                                        validator: this.validateCaptchaBlur,
                                    }
                                ]} hasFeedback>
                            <Input allowClear placeholder="短信验证码" />
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
                        <Form.Item wrapperCol={{ xs: { span: 24},sm:{span: 6, offset: 8 }}}>
                            <Button type="primary" htmlType="submit" loading={loading} style={{width: '100%'}}>
                                提交修改
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }
}
const LayoutComponent = Updatepwd;
function mapStateToProps(state) {
    return {
    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })