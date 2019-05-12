const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
  /*用户名 密码 类别 头像 简介 职位名 公司 薪资*/
  user:{
    type:String,
    require:true
  },
  pwd:{
    type:String,
    require:true
  },
  type:{
    type:String,
    require:true
  },
  avatar:{
    type:String,
  },
  desc:{
    type:String,
  },
  title:{
    type:String
  },
  company:{
    type:String,
  },
  money:{
    type:String
  },
  age:{
    type:Number,
    require:true
  }
})

module.exports = mongoose.model('user',userSchema)