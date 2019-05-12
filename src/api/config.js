import axios from 'axios'
import {Toast} from 'antd-mobile'

let api = axios.create({
  baseURL:'/api'
})

api.interceptors.request.use((config)=>{
  Toast.loading('加载中',0)
  return config
},error=>{
  Toast.fail('请求失败', 3)
  return Promise.resolve(error.response)
})

api.interceptors.response.use((config)=>{
  Toast.hide()
  return config
},error=>{
  Toast.fail('服务器未响应', 3)
  return Promise.resolve(error.response)
})

export default api