import React, {useState} from 'react';
import DisplayTweets from './Modules/DisplayTweets'
import DisplayDatabases from './Modules/DisplayDatabases'

//Services
import apiService from './Services/ApiService'

//CSS
import './css/Style.css'
import './css/Grid.css'

const App = () => {
  const [tweet, newTweet] = useState([])
  const [databases, newDatabases] = useState(['no files'])

  const updateData = () => {
    const tweetResponse = apiService.GetData('/api')
    tweetResponse.then(response => newTweet(response))
    const dbResponse = apiService.GetData('/getDatabases')
    dbResponse.then(response => newDatabases(response))
  }

  return (
    <div className='pageWrapper center'>
      <div className='pageHeader'><h1>Twittie</h1></div>
      <div className='pageSpacer'></div>
      <div className='pageSidebar'>
        <button onClick={updateData}>Update Tweet table</button>
        <h2>Choose your DB</h2>
        <DisplayDatabases data={databases} />
      </div>
      <div className='pageContent'>
        <div className='tweetTable'>
          <DisplayTweets data={tweet} />
        </div>
      </div>
    </div>
  );
}

export default App;
