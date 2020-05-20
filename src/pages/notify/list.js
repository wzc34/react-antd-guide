/**
 * 消息
 * Created by wangzc on 06/24/2019.
 */
import React from 'react'
import connectComponent from '@common/connectComponent'
import methods from '@common/methods'
import { Card, Col, Row, Button, Typography, List, Modal,message, Empty } from 'antd'
import constants from '@common/constants';

class NotifyList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account: {},
            loading: true,
            notifyList: [],
            showModal: false,
            notifyInfo:{},
            isMore: 0,
            currentPage: 1,
            total: 0,
        };
    }
    componentDidMount() {
        const account = JSON.parse(methods.getLocalStorage(constants.localKey.accountInfo))
        this.setState({ account: account }, () => {
            this.getNotifyList()
        })
    }
    getNotifyList() {
        let { notifyList, account,currentPage, isMore } = this.state
        let param = {}
        param.userId = account.id
        param.currentPage = currentPage
        this.props.actions.getNotifyList({
            param,
            resolved: (res) => {
                const data = res
                const total = data.page.total
                const totalPage = data.page.totalPage
                if (data.items.length > 0) {
                    notifyList = notifyList.concat(data.items)
                    if (currentPage < totalPage) {
                        isMore = 1
                        currentPage++
                    } else {
                        if (totalPage > 1) {
                            isMore = 2
                        } else {
                            isMore = -1 // 数据只有一页时，more不显示任务状态
                        }
                    }
                } else {
                    if (total > 0) {
                        isMore = 2
                    }
                }
                this.setState({
                    isMore,
                    currentPage,
                    loading: false,
                    notifyList,
                    total
                })
            }, rejected: (e) => {
                this.setState({ loading: false })
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
                this.setState({notifyInfo:res,showModal:true})
                this.handleQuery()
            }, rejected: (e) => {
            }
        })
    }

    handleQuery () {
        this.setState({notifyList: [], currentPage: 1, isMore: 0}, ()=> this.getNotifyList())
    }

    updateReadAll(){
        this.props.actions.updateNotifyReadAll({
            userId:this.state.account.id,
            resolved: (res) => {
                message.success('操作成功');
               this.handleQuery()
            }, rejected: (e) => {
            }
        })
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
                <Col><Button size='small' type="link" onClick={(e)=>this.showNotifyInfo(item.id)}>查看</Button></Col>
                <Col>{methods.fromNow(item.ctime)}</Col>
            </Row>
        }
        return (
            <Card title='通知' extra={<Button type="link" onClick={()=>this.updateReadAll()}>全部已读</Button>}>
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
                {this.loadMore()}
            </Card>
        )
    }
    loadMore() {
        const { isMore, loading } = this.state
        if (!loading) {
            if (isMore === 1) {
                return (
                    <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px', }}>
                        <Button onClick={() => this.getNotifyList()}>加载更多</Button>
                    </div>
                )
            } else if (isMore === 2) {
                return (
                    <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px', color: '#999' }}>已经到底了</div>
                )
            }
        }
        return null
    }
    render() {
        let {notifyInfo,showModal} = this.state
        return (
            <div className="container">
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
const LayoutComponent = NotifyList;
function mapStateToProps(state) {
    return {
    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })