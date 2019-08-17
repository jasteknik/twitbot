import React, {useState} from 'react';
//import Parser from './Services/Parser';
import Axios from 'axios'
import './css/Style.css'

const App = () => {
  const [tweet, newTweet] = useState([])


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
          
        </div>
      )
    )
  }

  return (
    <div>
      <h1>Twittie</h1>
      <button onClick={GetData}>Getdata</button>
      <div className='tweetTable'>
        <DisplayTweet data={tweet} />
      </div>
    </div>
  );
}
export default App;
