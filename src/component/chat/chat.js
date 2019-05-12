import React from 'react'
import {List,InputItem,NavBar,Icon,Grid} from 'antd-mobile'
import {connect} from 'react-redux'
import {sendMsg,getMsgList,recvMsg,readMsg} from '../../redux/chat.redux'
import {getChatId} from '../../util'

@connect(
  state=>state,
  {sendMsg,getMsgList,recvMsg,readMsg}
)
class Chat extends React.Component{
  constructor(props){
    super(props)
    this.state={
      text:'',
      msg:[],
      showEmoji:false
    }
  }
  componentDidMount(){
   if(this.props.chat.chatmsg.length===0){
     this.props.getMsgList()
     this.props.recvMsg()
   }
   this.fixCarousel()
  }
  fixCarousel(){
    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'))
    })
  }
  componentWillUnmount(){
    const to = this.props.match.params.user
    this.props.readMsg(to)
  }
  handleSubmit(){
    const from = this.props.user._id
    const to = this.props.match.params.user
    const msg = this.state.text
    this.props.sendMsg({from,to,msg})
    this.setState({text:''})
  }
  render(){
    const emoji =`😄 😃 😀 😊  😉 😍 😘 😚 😗 😙 😜 😝 😛 😳 😁 😔 😌 😒 😞 😣 😢 😂 😭 😪 😥 😰
     😅 😓 😩 😫 😨 😱 😠 😡 😤 😖 😆 😋 😷 😎 😴 😵 😲 😟
      😦 😧 😈 👿 😮 😬 😐 😕 😯 😶 😇 😏 😑`.split(' ').filter(v=>v).map(v=>({
      text:v
    }))
    const userid = this.props.match.params.user
    const Item = List.Item
    const users = this.props.chat.users
    const chatid = getChatId(userid,this.props.user._id)
    const chatmsg = this.props.chat.chatmsg.filter(v=>v.chatid === chatid)
    if(!users[userid]){
      return null
    }
    return(
     <div>
       <NavBar
         mode="dark"
         icon={<Icon type="left"/>}
         onLeftClick={()=>{
           this.props.history.goBack()
         }}
       >{users[userid].name}</NavBar>

       <div id="chat-page">
         {chatmsg.map(v=>{
           console.log(users[v.from].avatar)
           const avatar = require(`../../img/${users[v.from].avatar}.png`)
           return v.from === userid ? (
             <List key={v._id}>
               <Item thumb={avatar}>{v.content}</Item>
             </List>
           ):(
             <List key={v._id}>
               <Item
                 className="chat-me"
                 extra={<img src={avatar} alt=""/>}
               >{v.content}</Item>
             </List>
           )
         })}
       </div>
       <div className="stick-footer">
         <List>
           <InputItem
             placeholder="请输入"
             value={this.state.text}
             onChange={(v)=>{this.setState({text:v})}}
             extra={<div>
               <span style={{marginRight:15}} onClick={()=>{this.setState({
                 showEmoji:!this.state.showEmoji
               })
                 this.fixCarousel()
               }}>😊</span>
               <span onClick={()=>this.handleSubmit()}>发送</span>
             </div>}
           >信息</InputItem>
         </List>
         {this.state.showEmoji?
           <Grid
             data={emoji}
             columnNum={9}
             carouselMaxRow={4}
             isCarousel={true}
             onClick={el=>{
               this.setState({
                 text:this.state.text+el.text
               })
             }}
         />
           :null}
       </div>
     </div>
    )
  }
}

export default Chat