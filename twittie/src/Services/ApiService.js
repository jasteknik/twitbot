import Axios from 'axios'

const baseUrl = 'http://localhost:3001'

const GetData = (url) => {
  const request = Axios.get(baseUrl + url)  
  return request.then(response => response.data)
}

const ChangeData = (url, data) => {
  const request = Axios.post(baseUrl + url, data)
  return request.then(response => response.data)
}

export default { GetData, ChangeData }