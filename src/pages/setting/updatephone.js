/**
 * 更改手机号
 * Created by wangzc on 06/24/2019.
 */
import React from 'react'
import CustomBreadcrumb from '@components/common/customBreadcrumb'
import connectComponent from '@common/connectComponent'
import { Card, Button, Form, Modal, message, Input, Row, Col } from 'antd'
import constants from '@common/constants';
import Countdown from '@components/Countdown'
import methods from '@common/methods'
const { confirm } = Modal
let captchaCount = 0
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6},
}
class Updatephone extends React.Component {
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

    // 验证手机号
    validateToPhone = (rule, value) => {
        if (value && !methods.phoneRegular(value)) {
            return Promise.reject('手机号不正确')
        }
        return Promise.resolve()
    }
    
    // 获取验证码
    getCaptcha () {
        const {account} = this.state
        const phone = this.formRef.current.getFieldValue("phone")||''
        if (phone && methods.trim(phone).length > 0) {
            if (methods.trim(phone) === account.phone) {
                message.error(`新手机号不能与原手机号相同`)
                return false
            }
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
    validateCaptchaBlur = async (rule, value) => {
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
            return Promise.resolve()
        }
    }
    // 验证手机是否已存在
    doCheckPhone(phone) {
        const { actions } = this.props
        actions.checkUser({
            account: phone,
            resolved: (res) => {
                if (res) {
                    message.error(`该手机号已存在，请输入其它手机号`)
                } else {
                    captchaCount ++
                    this.setState({captchaDisabled: true, captchaCountState: captchaCount, downTime: Date.now() + 60 * 1000})
                    this.doActionCatpcha(phone)
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
        this.showConfirm(values.phone)
    }

    showConfirm(phone) {
        const _this = this
        confirm({
          title: '提示',
          content: '更改手机号后须重新登录，登录手机号为新手机号，密码不变',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            _this.updateUserInfo(phone)
          },
          onCancel() {
            // console.log('Cancel');
          },
        });
    }

    updateUserInfo (phone) {
        const { actions } = this.props
        const { account } = this.state
        const user = {}
        user.id = account.id
        user.phone = phone
        this.setState({loading: true})
        actions.updateUserInfo({user: user,
            resolved: (res) => {
                if (res && res > 0) {
                    message.success(`修改成功`)
                    actions.doLogout({
                        account: phone,
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
                <CustomBreadcrumb arr={['设置','更改手机号']}/>
                <Card title="更改手机号" bordered={false}>
                    <Form {...formItemLayout} ref={this.formRef} scrollToFirstError onFinish={this.handleSubmit}>
                        <Form.Item label="原手机号">
                            {account.phone}
                        </Form.Item>
                        <Form.Item label="新手机号" name="phone"
                                rules={[{ required: true, message: '请输入新手机号' },
                                {
                                    validator: this.validateToPhone,
                                },
                            ]} hasFeedback>
                            <Input allowClear placeholder="新手机号"/>
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
                                        <Input allowClear placeholder="短信验证码"/>
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
const LayoutComponent = Updatephone;
function mapStateToProps(state) {
    return {
    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })