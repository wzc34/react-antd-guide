/**
 * 个人信息
 * Created by wangzc on 06/24/2019.
 */
import React from 'react'
import CustomBreadcrumb from '@components/common/customBreadcrumb'
import connectComponent from '@common/connectComponent'
import { Card, Descriptions, Button, Form, Upload, message, Input, Spin } from 'antd'
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons'
import constants from '@common/constants';
import methods from '@common/methods'
import Img from 'react-image'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
const cardUploadApi = process.env.REACT_APP_API + '/api/userInfo/card/img'
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 6},
}

class Personal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading1: false,
            loading2: false,
            isAuth: false,
            account: '',
            card1: '',
            card2: '',
            card1temp: '',
            card2temp: '',
            submitLoading: false,
            tmPic: '',
            tmPicVisible: false,
        };
    }

    formRef = React.createRef()

    componentDidMount() {
        // this.getUserInfo()
    }
    
    getUserInfo() {
        const account = JSON.parse(methods.getLocalStorage(constants.localKey.accountInfo))
        const { actions } = this.props
        actions.getUserInfo({phone: account.phone,
            resolved: (res) => {
                if (res) {
                    this.setState({account: res})
                }
            }, rejected: (e) => {
            }
        })
    }

    toAuth() {
        const { account } = this.state
        this.setState({isAuth: true}, ()=> {
            const form = this.formRef.current
            form.setFieldsValue({cnname:account.cnname})
        })
    }
    
    handleSubmit = values => {
        this.updateUserInfo(values)
    }


    updateUserInfo (values) {
        const { actions } = this.props
        const {account, card1, card2} = this.state
        const user = {}
        user.id = account.id
        user.cnname = values.cnname
        user.cardNo = values.cardNo
        user.card1 = card1
        user.card2 = card2
        user.email = values.email
        this.setState({ submitLoading: true})
        actions.updateUserInfo({user: user,
            resolved: (res) => {
                this.setState({ submitLoading: false})
                if (res && res > 0) {
                    this.setState({isAuth: false})
                    message.success('修改完成')
                    this.getUserInfo()
                }
            }, rejected: (e) => {
                this.setState({ submitLoading: false})
            }
        })
    }

    onBeforeUpload (file) {
        const isPic = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isPic) {
            message.error('请上传jpg,jpeg,png格式的图片')
        }
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isLt5M) {
            message.error('图片不能超过5M')
        }
        return isPic && isLt5M
    }
    onChangePicture1 = (info)=> {
        if (info.file.status) {
            if (info.file.status === 'uploading') {
                this.setState({ loading1: true });
                return;
            }
            if (info.file.status === 'done') {
                const res = info.file.response
                if (res.code === 200) {
                    this.getBase64(info.file.originFileObj, imageUrl =>
                        this.setState({
                            card1temp: imageUrl,
                            card1: res.data.url, 
                            loading1: false,
                        })
                    )
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败！`);
            }
        }
    }
    onChangePicture2 = (info)=> {
        if (info.file.status) {
            if (info.file.status === 'uploading') {
                this.setState({ loading2: true });
                return;
            }
            if (info.file.status === 'done') {
                const res = info.file.response
                if (res.code === 200) {
                    this.getBase64(info.file.originFileObj, imageUrl =>
                        this.setState({
                            card2temp: imageUrl,
                            card2: res.data.url, 
                            loading2: false,
                        })
                    )
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败！`);
            }
        }
    }
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    renderUserInfo () {
        const { isAuth, account } = this.state
        const cardNo = ()=> {
            let num = account.cardNo?account.cardNo.toString():null
            if (num && num.length === 18) {
                num = num.substr(0, 2) + '**************' + num.substr(16, 2)
            }
            return num || '暂无'
        }
        // if (account) {
            if (!isAuth) {
                return (
                    <div>
                        <Descriptions column={2}>
                            <Descriptions.Item label="姓名">{account.cnname}</Descriptions.Item>
                            <Descriptions.Item label="手机号">{account.phone}</Descriptions.Item>
                            <Descriptions.Item label="身份证号">{cardNo()}</Descriptions.Item>
                            <Descriptions.Item label="邮箱">{account.email || '暂无'}</Descriptions.Item>
                            <Descriptions.Item label="身份证">
                                <Img className='cursor' loader={<Spin size='small' />} src={account.card1} style={{ width: 40 }} onClick={() => {
                                this.setState({ tmPicVisible: true, tmPic: account.card1 })
                            }} />
                                <Img className='cursor' loader={<Spin size='small' />} src={account.card2} style={{ width: 40, marginLeft: 10 }} onClick={() => {
                                this.setState({ tmPicVisible: true, tmPic: account.card2 })
                            }} />
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )
            }
        // } else {
            // return <Skeleton></Skeleton>
        // }
    }

    render() {
        const { account, loading1, loading2, isAuth, card1temp, card2temp, submitLoading, tmPic, tmPicVisible } = this.state
        const uploadButton1 = (
            <div>
                {loading1 ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">上传正面</div>
            </div>
          )
        const uploadButton2 = (
            <div>
                {loading2 ? <LoadingOutlined /> : <PlusOutlined />}
              <div className="ant-upload-text">上传反面</div>
            </div>
          )
        return (
            <div className="container">
                <CustomBreadcrumb arr={['设置','个人信息']}/>
                <Card title={isAuth?'编辑信息':'个人信息'} bordered={false} extra={isAuth?<Button onClick={()=>this.setState({isAuth: false})}>返回</Button>:!account.cardNo && <Button type="primary" onClick={()=>this.toAuth()}>编辑</Button>}>
                    {this.renderUserInfo()}
                    {isAuth && (
                        <Form {...formItemLayout} ref={this.formRef} scrollToFirstError onFinish={this.handleSubmit}>
                            <Form.Item label="手机号">
                                <span>{account.phone}</span>
                            </Form.Item>
                            <Form.Item label="姓名" name="cnname"
                                rules={[{ required: true, message: '请输入姓名' },
                                    {
                                        max: 20,
                                        message: '姓名字数过长'
                                    }]} hasFeedback>
                                <Input placeholder="姓名" />
                            </Form.Item>
                            <Form.Item label="身份证号" name="cardNo"
                                rules={[{ required: true, message: '请输入身份证号' },
                                    {
                                        len: 18,
                                        message: '身份证号不正确'
                                    }]} hasFeedback>
                                <Input placeholder="身份证号" />
                            </Form.Item>
                            <Form.Item
                                label="身份证正面"
                                name="card1"
                                extra="上传图片格式：jpg，jpeg，png"
                                rules={[{ required: true, message: "请上传身份证正面" }]}
                                >

                                            <Upload
                                                name="file"
                                                listType="picture-card"
                                                showUploadList={false}
                                                action={`${cardUploadApi}?userId=${account.id}`}
                                                beforeUpload={(file)=>this.onBeforeUpload(file)}
                                                onChange={this.onChangePicture1}
                                            >
                                                {card1temp ? <img src={card1temp} alt="avatar" style={{ width: '100%' }} /> : uploadButton1}
                                            </Upload>

                            </Form.Item>
                            <Form.Item
                                label="身份证反面"
                                name="card2"
                                extra="上传图片格式：jpg，jpeg，png"
                                rules={[{ required: true, message: "请上传身份证反面" }]}
                                >

                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            showUploadList={false}
                                            action={`${cardUploadApi}?userId=${account.id}`}
                                            beforeUpload={(file)=>this.onBeforeUpload(file)}
                                            onChange={this.onChangePicture2}
                                        >
                                            {card2temp ? <img src={card2temp} alt="avatar" style={{ width: '100%' }} /> : uploadButton2}
                                        </Upload>

                            </Form.Item>
                            <Form.Item label="邮箱" name="email"
                                    rules={[{ message: '请输入邮箱地址' },
                                    {
                                        type: 'email',
                                        message: '请输入正确邮箱地址',
                                    },
                                    ]}>
                                <Input placeholder="邮箱" />
                            </Form.Item>
                            <Form.Item wrapperCol={{ wx:{span: 24}, sm:{span: 8, offset: 8}}}>
                                <Button type="primary" htmlType="submit" loading={submitLoading}>
                                    提交
                                </Button>
                                <Button type="defualt" onClick={()=>this.setState({isAuth: false})} style={{marginLeft: '20px'}}>
                                    取消
                                </Button>
                            </Form.Item>
                        </Form>
                     )}
                </Card>
                {tmPicVisible &&
                    (<Lightbox
                        mainSrc={tmPic}
                        clickOutsideToClose={true}
                        onCloseRequest={() => this.setState({ tmPicVisible: false })}
                        imageLoadErrorMessage={'图片加载失败'}
                        on
                    />)}
            </div>
        )
    }
}
const LayoutComponent = Personal;
function mapStateToProps(state) {
    return {
    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })