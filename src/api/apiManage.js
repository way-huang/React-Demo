import api from './config'

class ApiManage {
  static login(data){
    return api.post('/user/login',data)
  }
  static register(data){
    return api.post('/user/register',data)
  }
  static getInfo(){
    return api.get('/user/info')
  }
  static getList(obj){
    let query ='?'
    for(let n of Object.keys(obj)){
      query += `${n}=${obj[n]}&`
    }
    return api.get('/user/list'+query)
  }
  static updateInfo(data){
    return api.post('/user/update',data)
  }
  static getMsgList(){
    return api.get('/user/getmsglist')
  }
  static readMsg(data){
    return api.post('/user/readmsg',data)
  }
}

export default ApiManage