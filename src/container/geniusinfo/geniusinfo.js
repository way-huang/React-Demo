import React from 'react'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import {update} from '../../redux/user.redux'
@connect(
  state=>state.user,
  {update}
)
class GeniusInfo extends  React.Component{
  constructor(props){
    super(props)
    this.state = {
      title:'',
      desc:'',
      avatar:''
    }
    this.handlerUpdate = this.handlerUpdate.bind(this)
  }
  onChange(key,val){
    this.setState({
      [key]:val
    })
  }
  handlerUpdate(){
    this.props.update(this.state)
  }
  render(){
    const path = this.props.location.pathname
    const redirect = this.props.redirectTo
    return(
      <div>
        {redirect&&redirect!==path?<Redirect to={this.props.redirectTo}/>:null}
        <NavBar mode="dark">牛人完善信息页面</NavBar>
        <AvatarSelector selectAvatar={(v)=>{this.onChange('avatar',v)}}></AvatarSelector>
        <InputItem onChange={(v)=>{this.onChange('title',v)}}>
          求职岗位
        </InputItem>
        <TextareaItem
          title="个人简介"
          rows={3}
          autoHeight
          onChange={(v)=>{this.onChange('desc',v)}}>
        </TextareaItem>
        <Button type="primary" onClick={this.handlerUpdate}>保存</Button>
      </div>
    )
  }
}

export default  GeniusInfo