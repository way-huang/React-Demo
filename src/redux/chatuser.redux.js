import ApiManage from '../api/apiManage'

const USER_LIST = 'USER_LIST'
const initState = {
  userList:[]
}

export function chatUser(state=initState,action){
  switch (action.type){
    case USER_LIST:
      return {...state,userList:action.payload}
    default:
      return state
  }
}

function userList(data){
  return {type:USER_LIST,payload:data}
}
export function getUserList(value){
  return dispatch=>{
    ApiManage.getList({type:value}).then((res)=>{
      if(res.data.code===0){
        dispatch(userList(res.data.data))
      }
    })
  }
}