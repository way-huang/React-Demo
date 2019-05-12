import ApiManage from '../api/apiManage'
import {getRedirectPath} from '../util'

/*const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'*/
const ERROR_MSG = ''
const LOAD_DATA ='LOAD_DATA'
const AUTH_SUCCESS = 'AUTH_SUCCESS'
const LOGOUT = 'LOGOUT'
const initState={
  redirectTo:'',
  /*isAuth:false,*/
  msg:'',
  user:'',
  type:''
}

//reducer 根据传入的action.type返回一个新的state
export function user(state=initState,action){
  switch (action.type){
    case AUTH_SUCCESS:
      return {...state,msg:'',redirectTo:getRedirectPath(action.payload),...action.payload}
    case LOAD_DATA:
      return {...state,...action.payload}
    case ERROR_MSG:
      return {...state,msg:action.msg}
    case LOGOUT:
      return {...initState,redirectTo:'/login'}
    default:
      return state
  }
}
/*action creator*/
function errorMsg(msg){
  return {type:ERROR_MSG,msg}
}
function authSuccess(data){
  const {pwd,...obj} = data
  return {type:AUTH_SUCCESS,payload:obj}
}

export function loadData(userInfo){
  return {type:LOAD_DATA,payload:userInfo}
}

/*action*/
export function register({user,pwd,repeatPwd,type}){
  if(!user||!pwd){
    return errorMsg('用户名密码必须输入')
  }
  if(pwd !== repeatPwd){
    return errorMsg("密码和确认密码不同")
  }
  return dispatch=>{
    ApiManage.register({user,pwd,type}).then((res)=>{
      if(res.data.code===0){
        dispatch(authSuccess({user,pwd,type}))
      }else{
        dispatch(errorMsg(res.data.msg))
      }
    })
  }
}
export function login({user,pwd}){
  if(!user||!pwd){
    return errorMsg('用户名密码必须输入')
  }
  return dispatch=>{
    ApiManage.login({user,pwd}).then((res)=>{
      if(res.data.code===0){
        dispatch(authSuccess(res.data.data))
      }else{
        dispatch(errorMsg(res.data.msg))
      }
    })
  }
}

export function update(data){
  return dispatch=>{
    ApiManage.updateInfo(data).then((res)=>{
      if(res.data.code===0){
        dispatch(authSuccess(res.data.data))
      }else{
        dispatch(errorMsg(res.data.msg))
      }
    })
  }
}

export function logoutSubmit(){
  return {type:LOGOUT}
}
