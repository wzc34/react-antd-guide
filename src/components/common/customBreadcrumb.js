import React from 'react'
import {Breadcrumb} from 'antd'
import {Link} from 'react-router'

const CustomBreadcrumb = (props)=>(
  <Breadcrumb style={{margin:15, position: 'relative', background: '#f0f2f5', height: '40px',lineHeight: '40px'}}>
    <Breadcrumb.Item><Link to='/index'>首页</Link></Breadcrumb.Item>
    {props.arr && props.arr.map(item=>{
      if ((typeof item) === 'object'){
        return <Breadcrumb.Item key={item.title}><Link to={item.to}>{item.title}</Link></Breadcrumb.Item>
      } else {
        return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
      }
    })}
  </Breadcrumb>
)
export default CustomBreadcrumb