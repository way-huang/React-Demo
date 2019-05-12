import io from 'socket.io-client'
import ApiManage from '../api/apiManage'

const socket =  io('ws://192.168.199.254:8080')
//方法
function getUnread(arr=[],id=''){
  return arr.filter(v=>!v.unread&&v.to===id).length
}

/*常量 && 初始值*/
/*获取聊天列表*/
const MSG_LIST = 'MSG_LIST'
/*读取信息*/
const MSG_RECV = 'MSG_RECV'
/*标识已读*/
const MSG_READ = 'MSG_READ'

const initState = {
  chatmsg:[],
  users:{},//用户名和头像信息
  unread:0
}
/*reducer*/
export function chat(state=initState,action){
  switch (action.type){
    case MSG_LIST:
      return {...state,chatmsg:action.payload.data,users:action.payload.msg,unread:getUnread(action.payload.data,action.payload.id)}
    case MSG_RECV:
      const n = action.payload.to ===action.userid?1:0
      return {...state,chatmsg:[...state.chatmsg,action.payload],unread:state.unread+n}
    case MSG_READ:
      const {from,unread,num} = action.payload
      return {...state,chatmsg:state.chatmsg.map(v=>{
        if(from===v.from){
          v.read=true
        }
        return v
      }),unread:state.unread-num}
    default:
      return state
  }
}
/*action && action creator*/
function msgList(data,msg,id){
  return {type:MSG_LIST,payload:{data,msg,id}}
}
function msgRecv(msg,id){
  return {type:MSG_RECV,payload:msg,id}
}
function msgRead({from,to,num}){
  return {type:MSG_READ,payload:{from,to,num}}
}

export function getMsgList(){
  return (dispatch,getState)=>{
    ApiManage.getMsgList().then((res)=>{
      if(res.data.code===0){
        let userid = getState().user._id
        dispatch(msgList(res.data.data,res.data.msg,userid))
      }
    })
  }
}
export function sendMsg({from,to,msg}){
  return dispatch=>{
    socket.emit('sendmsg',{from,to,msg})
  }
}
export function recvMsg(){
  return (dispatch,getState)=>{
    socket.on('recvmsg',function(data){
      let userid = getState().user._id
      dispatch(msgRecv(data,userid))
    })
  }
}
export function readMsg(from){
  return (dispatch,getState)=>{
    ApiManage.readMsg({from}).then(res=>{
      const userid = getState().user._id
      if(res.data.code===0){
        dispatch(msgRead({userid,from,num:res.data.data}))
      }
    })
  }
}