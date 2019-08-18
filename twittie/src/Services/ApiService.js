import Axios from 'axios'

const baseUrl = 'http://localhost:3001'

const GetData = (url) => {
  const request = Axios.get(baseUrl + url)  
  return request.then(response => response.data)
}

const ChangeData = (url, data, config) => {
  const request = Axios.post(baseUrl + url, data, config)
  return request.then(response => response.data)
}

export default { GetData, ChangeData }