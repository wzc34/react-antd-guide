/*
 * @Description: 菜单
 * @Autor: wangzc
 * @Date: 2020-05-07 10:17:45
 * @LastEditors: wangzc
 * @LastEditTime: 2020-05-08 12:29:11
 */
import React from 'react'
import CustomMenu from "./customMenu";
import {HomeOutlined, SettingOutlined} from '@ant-design/icons'

const menus = [
    {
        title: '首页',
        icon: <HomeOutlined />,
        key: '/index'
    },
    {
        title: '设置',
        icon: <SettingOutlined />,
        key: '/setting',
        subs: [
            { key: '/setting/personal', title: '个人信息' },
            { key: '/setting/updatepwd', title: '修改密码' },
            { key: '/setting/updatephone', title: '更改手机号' },
        ]
    },
]

class SiderNav extends React.Component {

    render() {
        return (
            <div style={{minHeight: '100vh',overflowY:'auto'}}>
                <div style={styles.logo}>
                    <img alt='' style={{width: '50px',padding: '5px'}} src={require('@img/logo1.png')}/>
                    <span style={{position: 'absolute', paddingTop: 14, paddingLeft:10}}>
          XXX平台
           </span>
                </div>
                <CustomMenu menus={menus} onToggleWap={this.props.onToggleWap} />
            </div>
        )
    }
}

const styles = {
    logo: {
        fontWeight: 'bolder',
        fontSize: 18,
        color: '#fff',
        margin: 16,
        position: 'relative',
        overflow: 'hidden',
    }
}

export default SiderNav