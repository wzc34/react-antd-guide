/**
 * 首页
 * Created by wangzc on 06/24/2019.
 */
import React from 'react'
import connectComponent from '@common/connectComponent'
import constants from '@common/constants';
import { Card, Col, Row, Button, Typography, List, Modal, Empty } from 'antd'
import { FormOutlined, RocketOutlined, CarryOutOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import methods from '@common/methods'
const { Meta } = Card

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            loading: false,
            notifyList: [],
            showModal: false,
            notifyInfo: {},
        };
    }
    componentDidMount() {
        const account = JSON.parse(methods.getLocalStorage(constants.localKey.accountInfo))
        this.setState({account: account}, () => this.getNotifyList())
    }

    getNotifyList() {
        let { notifyList, account } = this.state
        let param = {}
        param.currentPage = 1
        param.maxResults = 15
        param.userId = account.id
        this.setState({loading: true})
        this.props.actions.getNotifyList({
            param,
            resolved: (res) => {
                const data = res
                if (data.items.length > 0) {
                    notifyList = data.items
                }
                this.setState({
                    loading: false,
                    notifyList
                })
            }, rejected: (e) => {
                this.setState({loading: false})
            }
        })
    }
    showNotifyInfo(id) {
        let param = {
            id: id,
            userId: this.state.account.id
        }
        this.props.actions.getNotifyInfo({
            param,
            resolved: (res) => {
                this.setState({ notifyInfo: res, showModal: true })
                this.getNotifyList()
            }, rejected: (e) => {
            }
        })
    }

    renderIntrodution () {
        const bodyStyle = {
            height: 160,
            cursor: 'pointer'
        }
        return (
            <Row gutter={16}>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                    <Card bordered={false} bodyStyle={bodyStyle} onClick={()=>this.props.router.push('/daikuan/list')}>
                        <Card.Grid style={{width: '100%', height: '100%'}}>
                            <Meta
                                avatar={<FormOutlined style={{fontSize: 30}}/>}
                                title="在线申请"
                                description="审批全程网上办理；高效、快速、安全"
                            />
                        </Card.Grid>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                    <Card bordered={false} bodyStyle={bodyStyle} onClick={()=>this.props.router.push('/product/list')}>
                        <Card.Grid style={{width: '100%', height: '100%'}}>
                            <Meta
                                avatar={<RocketOutlined style={{fontSize: 30}}/>}
                                title="供给无缝衔接"
                                description="实现业务全流程自动监控；企业随时申请，银行随时发布产品"
                            />
                        </Card.Grid>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                    <Card bordered={false} bodyStyle={bodyStyle} onClick={()=>this.props.router.push('/pinggu/index')}>
                        <Card.Grid style={{width: '100%', height: '100%'}}>
                            <Meta
                                avatar={<CarryOutOutlined style={{fontSize: 30}}/>}
                                title="动态评估"
                                description="科学性体系化分析，非指标化，真正AI建模动态分析；客观、真实、全面、多维度数据支撑"
                            />
                        </Card.Grid>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                    <Card bordered={false} bodyStyle={bodyStyle} onClick={()=>this.props.router.push('/data/enterprise')}>
                        <Card.Grid style={{width: '100%', height: '100%'}}>
                            <Meta
                                avatar={<DeploymentUnitOutlined style={{fontSize: 30}}/>}
                                title="多方数据共享"
                                description="解决信息不对称问题；线下一对一传输，变成多对多交互"
                            />
                        </Card.Grid>
                    </Card>
                </Col>
            </Row>
        )
    }


    //渲染通知信息
    renderNotify() {
        const {loading, notifyList} = this.state
        let render_item = (item) => {
            let type = 'secondary', warn = '普通', className = 'col-normal'
            if (item.warnLevel === 1) {
                type = 'warning'
                warn = '重要'
            } else if (item.warnLevel === 2) {
                type = 'danger'
                warn = '紧急'
            }
            if (item.scope === 0) {
                if (item.p_read) {
                    className = 'col-disabled'
                }
            } else {
                if (item.countView > 0) {
                    className = 'col-disabled'
                }
            }
            return <Row gutter={16} className={className}>
                <Col><Typography.Text type={type}>[{warn}]</Typography.Text></Col>
                <Col>{methods.ellipsis(`${item.title}：${item.content}`,50,'...')}</Col>
                <Col><Button size='small' type="link" onClick={(e) => this.showNotifyInfo(item.id)}>查看</Button></Col>
                <Col>{methods.fromNow(item.ctime)}</Col>
            </Row>
        }
        return (
            <Card title='通知' extra={notifyList.length > 0 && <a href="/notify/list">更多</a>} style={{marginTop: 20}}>
                <List
                    loading={loading}
                    bordered={false}
                    locale={{emptyText: <Empty description={<span style={{color: '#666'}}>暂无数据</span>}/>}}
                    dataSource={notifyList}
                    renderItem={item => (
                        <List.Item>
                            {render_item(item)}
                        </List.Item>
                    )}
                />
            </Card>
        )
    }

    render() {
        const { notifyInfo, showModal} = this.state
        return (
            <div className="container">
                {this.renderIntrodution()}

                {this.renderNotify()}


                {showModal && notifyInfo.title && (
                    <Modal
                        visible={showModal}
                        title={notifyInfo.title}
                        onOk={(e) => this.setState({ showModal: false })}
                        onCancel={(e) => this.setState({ showModal: false })}
                        footer={[
                            <Button key="back" onClick={(e) => this.setState({ showModal: false })}>关闭</Button>,
                        ]}
                    >
                        <div>{`${notifyInfo.content}（${methods.time10ToStr(notifyInfo.ctime)}）`}</div>
                    </Modal>
                )}
            </div>
        )
    }
}
const LayoutComponent = Index;
function mapStateToProps(state) {
    return {
        // companyLineChart: state.company.companyLineChart
    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })