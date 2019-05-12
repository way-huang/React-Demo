import React from 'react'
import {connect} from 'react-redux'
import {List,Badge} from 'antd-mobile'

@connect(
  state=>state,
  {}
)
class Msg extends React.Component{

  getLast(arr){
    return arr[arr.length-1]
  }
  render() {
    const Item = List.Item
    const Brief = Item.Brief
    const userid = this.props.user._id
    const userinfo = this.props.chat.users
    const msgGroup = {}
    this.props.chat.chatmsg.forEach(v=>{
      msgGroup[v.chatid] = msgGroup[v.chatid]||[]
      msgGroup[v.chatid].push(v)
    })
    const chatList = Object.values(msgGroup).sort((a,b)=>{
      const a_last = this.getLast(a).createTime,
            b_last = this.getLast(b).createTime
      return b_last - a_last
    })

    return (
      <div>
        <List>
          {chatList.map(v=>{
            const lastItem = this.getLast(v)
            const targetId = v[0].from ===userid?v[0].to:v[0].from
            if(!this.props.chat.chatmsg.length ){
              return null
            }
            if(!this.props.chat.users[targetId]){
              return null
            }
            const name = this.props.chat.users[targetId]?this.props.chat.users[targetId].name:'ghost'
            const avatar =this.props.chat.users[targetId] ?this.props.chat.users[targetId].avatar:'pig'
            const unreadNum = v.filter(v=>!v.read&&v.to===userid).length

            return(
              <Item
                extra={<Badge text={unreadNum}/>}
                thumb={require(`../../img/${avatar}.png`)} key={lastItem._id}
                arrow="horizontal"
                onClick={()=>{
                  this.props.history.push(`/chat/${targetId}`)
                }}
              >
                {name}
                <Brief>{lastItem.content}</Brief>
              </Item>
            )
          })}
        </List>
      </div>
    )
  }
}

export default Msg