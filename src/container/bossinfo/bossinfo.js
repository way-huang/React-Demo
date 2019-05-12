import React from 'react'
import {NavBar,InputItem,TextareaItem,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import {update} from '../../redux/user.redux'
import hocForm  from '../../component/hoc-form/hoc-form'
@connect(
  state=>state.user,
  {update}
)
@hocForm
class BossInfo extends  React.Component{
  constructor(props){
    super(props)
    this.handlerUpdate = this.handlerUpdate.bind(this)
  }
  handlerUpdate(){
    this.props.update(this.props.state)
  }
  render(){
    const path = this.props.location.pathname
    const redirect = this.props.redirectTo
    return(
      <div>
        {redirect&&redirect!==path?<Redirect to={this.props.redirectTo}/>:null}
        <NavBar mode="dark">BOSS完善信息页面</NavBar>
        <AvatarSelector selectAvatar={(v)=>{this.props.handleChange('avatar',v)}}></AvatarSelector>
        <InputItem onChange={(v)=>{this.props.handleChange('company',v)}}>
          公司名称
        </InputItem>
        <InputItem onChange={(v)=>{this.props.handleChange('title',v)}}>
          招聘职位
        </InputItem>
        <InputItem onChange={(v)=>{this.props.handleChange('money',v)}}>
          薪资范围
        </InputItem>
        <TextareaItem
          title="职位要求"
          rows={3}
          autoHeight
          onChange={(v)=>{this.props.handleChange('desc',v)}}>
        </TextareaItem>
        <Button type="primary" onClick={this.handlerUpdate}>保存</Button>
      </div>
    )
  }
}

export default  BossInfo