var express = require('express');
var router = express.Router();
const utility = require('utility')
const mongoose = require('mongoose')
const users = require('../model/users')
const chats = require('../model/chats')
const socketio = require('socket.io')

mongoose.connect('mongodb://127.0.0.1:27017/job')

mongoose.connection.on("connected",function(){
  console.log("连接成功")
})

mongoose.connection.on("error",function(){
  console.log("连接失败")
})

mongoose.connection.on("disconnected",function(){
  console.log("连接断开")
})




const _filter = {'pwd':0,'__v':0}

function md5Pwd(pwd){
  const salt = 'calabash_is_your_dad'
  return utility.md5(utility.md5(pwd+salt))
}
function rsp(code=0,data='',msg=''){
  return {code,data,msg}
}
/*
* socket.io
* */
router.prepareSocketIO = function (server) {
  let io = socketio.listen(server);

  io.on('connection',function(socket){
    console.log('已经连接')
    socket.on('sendmsg',function(data){
      const { from ,to ,msg} = data
      const chatid = [from,to].sort().join('_')
      const createTime = new Date().getTime()
      chats.create({chatid,from,to,content:msg,createTime},function(err,doc){
        io.emit('recvmsg',Object.assign({},doc._doc))
      })
    })
  })
};

/*
* cookie检测
* */
function checkCookies(req,res){
  const userid = req.cookies.userid
  if(!userid){
    return res.json(rsp(1))
  }
}
/*
 * 获取所有用户
 * */
router.get('/list',function(req,res){
  const query = req.query?req.query:{}
  users.find(query,_filter,function(err,doc){
    return res.json(rsp(0,doc))
  })
})
/*
* 获取个人信息
* */
router.get('/info', function(req, res) {
  checkCookies(req,res)
  const userid = mongoose.Types.ObjectId(req.cookies.userid)
  users.findOne({_id:userid},_filter,(err,doc)=>{
    if(err){
      return res.json(rsp(1,'','服务器错误'))
    }
    if(doc){
      return res.json(rsp(0,doc,''))
    }
  })
});
/*
* 注册
* */
router.post('/register',function(req,res){
  const {user,pwd,type} = req.body
  users.findOne({user},function(err,doc){
    if(doc){
      return res.json(rsp(1,'','改账号已注册'))
    }
    const newUser = new users({user,pwd:md5Pwd(pwd),type})
    newUser.save(function(e,d){
      if(e){
        return res.json(rsp(1,'','服务器错误'))
      }
      const {user,type,_id} = d
      res.cookie('userid',_id)
      return res.json(rsp(0,{user,type,_id},''))
    })
  })
})
/*
* 登录
* */
router.post('/login',function(req,res){
  const {user,pwd} = req.body
  users.findOne({user,pwd:md5Pwd(pwd)},_filter,(err,doc)=>{
    if(!doc){
      return res.json(rsp(1,'','用户名或密码错误'))
    }
    res.cookie('userid',doc._id)
    return res.json(rsp(0,doc,''))
  })
})
/*
* 更新信息
* */
router.post('/update',function(req,res){
  checkCookies(req,res)
  const body = req.body
  users.findByIdAndUpdate(req.cookies.userid,body,(err,doc)=>{
    const data = Object.assign({},{
      user:doc.user,
      type:doc.type
    },body)
    return res.json(rsp(0,data))
  })
})
/*
* 获取聊天信息
* */
router.get('/getmsglist',function(req,res){
  const user = req.cookies.userid
/*  let id = mongoose.Types.ObjectId(user)*/
  users.find({},function(err,userdoc){
    let users ={}
    userdoc.forEach(v=>{
      users[v._id.toString()] = {name:v.user,avatar:v.avatar}
    })
    chats.find({'$or':[{from:user},{to:user}]},(err,doc)=>{
      if(!err){
        return res.json(rsp(0,doc,users))
      }
    })
  })

})
/*
* 已读信息
* */
router.post('/readmsg',function(req,res){
  const userid = req.cookies.userid
  const {from} =req.body
  chats.update({from,to:userid},{'$set':{read:true}},{'multi':true},(err,doc)=>{
    if(!err){
      return res.json(rsp(0,doc.nModified))
    }
    return res.json(rsp(1,'','修改失败 '))
  })
})
module.exports = router;
