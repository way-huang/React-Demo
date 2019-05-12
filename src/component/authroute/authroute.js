import React from 'react'
import ApiManage from '../../api/apiManage'
import {withRouter} from 'react-router-dom'
import {loadData} from '../../redux/user.redux'
import {connect} from 'react-redux'

@withRouter
@connect(
  null,
  {loadData}
)
class AuthRoute extends  React.Component{
  componentDidMount(){
    const publicList = ['/login','/register']
    const pathname = this.props.location.pathname
    if(publicList.indexOf(pathname)>-1){
      return null
    }
    ApiManage.getInfo().then((res)=>{
      if(res.data.code===0){
        this.props.loadData(res.data.data)
      }else{
        this.props.history.push('/login')
      }
    })
  }
  render(){
    return(
      null
    )
  }
}

export default  AuthRoute