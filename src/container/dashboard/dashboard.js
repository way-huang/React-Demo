import React from 'react'
import {Route,Switch} from 'react-router-dom'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'
import NavLinkBar from '../../component/navlink/navlink'
import Boss from '../../component/boss/boss'
import Genius from '../../component/genius/genius'
import User from '../../component/user/user'
import Msg from '../../component/msg/msg'
import {getMsgList,recvMsg} from '../../redux/chat.redux'


@connect(
  state=>state,
  {getMsgList,recvMsg}
)
class DashBoard extends React.Component{
  componentDidMount(){
    if(!this.props.chat.chatmsg.length){
      this.props.getMsgList()
      this.props.recvMsg()
    }
  }
  render(){
    const {pathname} = this.props.location
    const user = this.props.user
    const navList = [
      {
        path:'/boss',
        text:'牛人',
        icon:'boss',
        title:'牛人列表',
        component:Boss,
        hide:user.type==='genius'
      },{
        path:'/genius',
        text:'boss',
        icon:'job',
        title:'BOSS列表',
        component:Genius,
        hide:user.type==='boss'
      },{
        path:'/msg',
        text:'消息',
        icon:'msg',
        title:'消息列表',
        component:Msg,
      },{
        path:'/me',
        text:'我',
        icon:'user',
        title:'个人中心',
        component:User,
      }
    ]
    const title= navList.find(v=>v.path===pathname).title
    if(!title){
      return null
    }
    return(
      <div>
        <NavBar mode="dark" className="fixed-header">{title}</NavBar>
        <div style={{marginTop:25}}>
          <Switch>
            {navList.map(v=>(
              <Route key={v.path} path={v.path} component={v.component}/>
            ))}
          </Switch>
        </div>
        <NavLinkBar data={navList}></NavLinkBar>
      </div>
    )
  }
}

export default DashBoard