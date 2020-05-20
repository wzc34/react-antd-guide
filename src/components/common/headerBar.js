import React from 'react'
import { Badge, Dropdown, Menu, Row, Col, Avatar, Typography } from 'antd'
import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import methods from '@common/methods'
import constants from '@common/constants';
import events from '@common/events'
import _ from 'lodash'

class HeaderBar extends React.Component {
    state = {
        account:{},
        noViewNotifyList: [],//未读的通知
    }

    componentDidMount () {
        const accountJsonStr = methods.getLocalStorage(constants.localKey.accountInfo)
        if (accountJsonStr) {
            const account = JSON.parse(accountJsonStr)
            this.setState({account: account}, ()=>this.getNotifyList())
        }

        events.on('event_sync_task',()=>{
            setTimeout(() => {
                this.getNotifyList()
            }, 500);
        })
    }

    getNotifyList() {
        let { account } = this.state
        let param = {}
        param.currentPage = 1
        param.maxResults = 50
        param.userId = account.id
        this.props.actions.getNotifyList({
            param,
            resolved: (res) => {
                const data = res
                if (data.items.length > 0) {
                    let arr = _.filter(data.items, function(o) { return o.countView===0 })
                    this.setState({noViewNotifyList: arr})
                }

            }, rejected: (e) => {
            }
        })
    }

    toggle = () => {
        if (methods.isWap()) {
            this.props.onToggleWap()
        } else {
            this.props.onToggle()
        }
    }

    doLogout () {
        this.props.doLogout()
    }

    render () {
        const {account, noViewNotifyList} = this.state
        const {collapsed} = this.props
        let firstName = ''
        if (account.cnname) {
            const cnname = account.cnname + ''
            firstName = cnname.substr(0,1)
        }

        const menu = (
            <Menu className='menu'>
                <Menu.ItemGroup title='用户中心' className='menu-group'>
                    <Menu.Item><span onClick={()=>this.props.router.push('/setting/personal')}><UserOutlined />个人信息</span></Menu.Item>
                    <Menu.Item><span onClick={()=>this.doLogout()}><LogoutOutlined />退出登录</span></Menu.Item>
                </Menu.ItemGroup>
            </Menu>
        )
        const login = (
            <Dropdown overlay={menu}>
                <Avatar style={{ backgroundColor: '#007ACC', verticalAlign: 'middle' }} size="default">
                    {firstName}
                </Avatar>
            </Dropdown>
        )
        const noticeMenu = (
            <Menu className='menu'>
                <Menu.ItemGroup title='消息通知' className='menu-group'>
                    {noViewNotifyList.length>0 && noViewNotifyList.map((item, i)=>{
                        let type = 'secondary', warn = '普通'
                        if (item.warnLevel === 1) {
                            type = 'warning'
                            warn = '重要'
                        } else if (item.warnLevel === 2) {
                            type = 'danger'
                            warn = '紧急'
                        }
                        if(i<5) {
                            return (<Menu.Item key={i}><Typography.Text type={type}>[{warn}]</Typography.Text><span onClick={()=>this.props.router.push('/notify/list')}>{methods.ellipsis(`${item.title}：${item.content}`,30,'...')}</span></Menu.Item>)
                        } else {
                            if(i === 5){
                                return (<Menu.Item key={1000} style={{textAlign: 'center', color: '#007ACC'}}><span onClick={()=>this.props.router.push('/notify/list')}>查看更多</span></Menu.Item>)
                            }
                        }
                        return null
                    })}
                </Menu.ItemGroup>
            </Menu>
        )
        return (
            <Row type="flex" justify="space-between">
                <Col span={4}>
                    {collapsed ? <MenuUnfoldOutlined className='trigger' onClick={this.toggle}/> : <MenuFoldOutlined className='trigger' onClick={this.toggle}/>}
                </Col>
                <Col span={20}>
                    <Row style={{float: 'right', display: 'flex'}}>
                        <Col>
                            <div style={{float:'left', paddingBottom: '4px'}}>{account.companyName}</div>
                        </Col>
                        <Col>
                            <ul className='header-ul'>
                                <li>
                                    <Dropdown overlay={noticeMenu}>
                                        <div style={{height: '100%'}}>
                                            <Badge count={noViewNotifyList.length} overflowCount={99} style={{marginRight: -3, cursor: 'pointer'}}>
                                                <BellOutlined style={{cursor: 'pointer'}}/>
                                            </Badge>
                                        </div>
                                    </Dropdown>
                                </li>
                                <li style={{cursor: 'pointer'}}>
                                    {login}
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default HeaderBar