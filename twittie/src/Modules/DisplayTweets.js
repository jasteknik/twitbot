import React from 'react'

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

export default DisplayTweet;