import React, {useState} from 'react';
//import Parser from './Services/Parser';
import Axios from 'axios'
import './css/Style.css'

const App = () => {
  const [tweet, newTweet] = useState([])
  const [databases, newDatabases] = useState(['no files'])

  const GetData = () => {
    //Getdata from server
    console.log('get data from server')
    Axios.get('http://localhost:3001/api')
      .then(response => {
        //console.log("Response from server:")
        //console.log(response)
        newTweet(response.data) //get user from tweet data
      })
      .catch(err => 
        console.log('error on server data: ' + err))
    
    Axios.get('http://localhost:3001/getDatabases')
      .then(response => {
        console.log("Response from server:")
        console.log("files" + response.data)
        newDatabases(response.data) //get user from tweet data
      })
      .catch(err => 
        console.log('error on server data: ' + err))   
  }
  
  const DisplayDatabases = (props) => {
    console.log("propsss" + props.data)
    return (
      
      props.data.map((file, key) => <p key={key}>{file}</p>
          
      )
    )
  }

  const DisplayTweet = (props) => {
    //console.log("props objekti")
    console.log(props.data)

    return (
      props.data.map((twit, i) => 
        <div className='tweetWrapper' key={i}>
          <div className='twitHeader'><h3>{twit.user}</h3></div>
          <div className='twitFollowers'><p>{twit.followers_count}</p></div>
          <div className='twitContent'><p>{twit.userTweet}</p></div>
          <div className='reTwitContent'><p>{twit.reTweet}</p></div>
        </div>
      )
    )
  }

  return (
    <div className='pageWrapper'>
      <div className='pageHeader'><h1>Twittie</h1></div>
      <div className='pageSidebar'>
        <button onClick={GetData}>Getdata</button>
        <DisplayDatabases data={databases} />
      </div>
      <div className='pageContent'>
        <div className='tweetTable'>
          <DisplayTweet data={tweet} />
        </div>
      </div>
    </div>
  );
}
export default App;
