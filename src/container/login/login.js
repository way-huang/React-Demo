import React from 'react'
import Logo from '../../component/logo/logo'
import {List,InputItem,WingBlank,WhiteSpace,Button} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {login} from '../../redux/user.redux'
import hocForm  from '../../component/hoc-form/hoc-form'
@connect(
  state=>state.user,
  {login}
)
@hocForm
class Login extends React.Component{
  constructor(props){
    super(props);
    this.register = this.register.bind(this)
    this.handlerLogin = this.handlerLogin.bind(this)
  }
  handlerLogin(){
    this.props.login(this.props.state)
  }
  register(){
    this.props.history.push('/register')
  }
  render(){
    return (
      <div>
        {this.props.redirectTo&&this.props.redirectTo!=='/login'?<Redirect to={this.props.redirectTo}/>:null}
        <Logo/>
        <h2>登录</h2>
        <WingBlank>
          {this.props.msg?<p className="error-msg">{this.props.msg}</p>:null}
          <List>
            <InputItem onChange={(v)=>{this.props.handleChange('user',v)}}>用户</InputItem>
            <WhiteSpace/>
            <InputItem type="password" onChange={(v)=>{this.props.handleChange('pwd',v)}}>密码</InputItem>
            <WhiteSpace/>
          </List>
          <Button type="primary" onClick={this.handlerLogin}>登录</Button>
          <WhiteSpace/>
          <Button type="primary" onClick={this.register}>注册</Button>
        </WingBlank>
      </div>
    )
  }
}
export default Login