import React from 'react'
import DisplayUrls from './DisplayUrls'
import DisplayList from './DisplayList'
import DisplayTweetBasic from './DisplayTweetBasic'

const displayTweet = (props) => {
  const noData = {
    profile_image_url: '',
    user: 'NO USER',
    followers_count: '#',
    userTweet: 'NO CONTENT'
  }
  
  console.log("props objekti")
  console.log(props.data)
  const AFI = false
  //Check case for return
  if(props.data.length !== 0){
    return(
      <div className='tweetWrapper' >
        <DisplayTweetBasic data={props.data[0]} />
        <div className='twitInfo'>
          <p>#:</p>
          <ul><DisplayList data={props.data[0].hashtags} /></ul>  
          <p>LINKS:</p>
          <DisplayUrls links={props.data[0].urls} />
        </div>
      </div>
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