/**
 * React
 * Created by wangzc on 02/20/2019.
 */
import React from 'react'
import connectComponent from '@common/connectComponent'
import {Layout, Drawer} from 'antd'
import methods from '@common/methods'
import SiderNav from '@components/common/siderNav'
import HeaderBar from '@components/common/headerBar'
const {Sider, Header, Content, Footer} = Layout

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false, // 菜单缩小与展开， 默认展开
            isWap: false,
            visible: false,
        }
    }
    componentDidMount() {
        if (methods.isWap()) {
            this.setState({collapsed: true})
        } else {
            const collapsed = methods.getLocalStorage('collapsed')
            this.setState({collapsed: collapsed ==='true' ? true: false})
        }
        this.setState({isWap: methods.isWap()})
    }

    toggle = () => {
        this.setState({
          collapsed: !this.state.collapsed
        })
        methods.setLocalStorage('collapsed', !this.state.collapsed)
    }
    doLogout(){
        let { actions, router } = this.props
        actions.doLogout({
          resolved: (res) => {
            router.push('/login')
          }, rejected: (e) => {}
        })        
    }
    onClose = () => {
        this.setState({visible: false});
    }
    onToggleWap = () => {
        this.setState({visible: !this.state.visible});
    }
    renderSiderNav () {
        const {isWap, visible} = this.state
        if (isWap) { // wap
            return (
                <Drawer
                    placement={'left'}
                    closable={false}
                    onClose={this.onClose}
                    visible={visible}
                    bodyStyle={{backgroundColor: '#001529', padding: 0}}
                    >
                    <SiderNav onToggleWap={this.onToggleWap}/>

                </Drawer>
            )
        } else { // pc
            return (
                <Sider collapsible
                        width={256}
                        trigger={null}
                        collapsed={this.state.collapsed}
                        >

                        <SiderNav/>

                </Sider>
            )
        }
    }
    render() {
        return (
            <Layout>
                {this.renderSiderNav()}
                <Layout>
                    <Header style={{background: '#fff', padding: '0 16px'}}>
                        <HeaderBar router={this.props.router} actions={this.props.actions} doLogout={()=>{this.doLogout()}} collapsed={this.state.collapsed} onToggle={this.toggle} onToggleWap={this.onToggleWap}/>
                    </Header>
                    <Content>
                        {this.props.children}
                    </Content>
                    {/* <Footer style={{textAlign: 'center'}}>Copyright &copy; {new Date().getFullYear()} 北京东方融信达软件技术有限公司</Footer> */}
                    <Footer style={{textAlign: 'center'}}>Copyright &copy; {new Date().getFullYear()}</Footer>
                </Layout>
            </Layout>
        )
    }
}
const LayoutComponent = App;
function mapStateToProps(state) {
    return {

    }
}

export default connectComponent({ mapStateToProps, LayoutComponent })