import React from 'react'
import DisplayTweetBasic from './DisplayTweetBasic'

const displayTweet = (props) => {
  const noData = {
    profile_image_url: '',
    user: 'NO USER',
    followers_count: '#',
    userTweet: 'NO CONTENT',
    hashtags: [],
    urls: []
  }
  
  //Check case for return
  if(props.data.length !== 0){  
    return(
      props.data.map((twit, i) => 
        <div className='tweetWrapper' key={i} >
          <DisplayTweetBasic data={twit} />
        </div>
      )
    )   
  }

  else return (
    <div className='tweetWrapper' key='0'>
      <DisplayTweetBasic data={noData} />
      <div className='twitInfo'></div>
    </div>
  ) 
}

export default displayTweet;