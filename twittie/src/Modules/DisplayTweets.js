import React from 'react'
import DisplayUrls from './DisplayUrls'
import DisplayList from './DisplayList'

const displayTweet = (props) => {
  //console.log("props objekti")
  //console.log(props.data)

  return (
    props.data.map((twit, i) => 
      <div className='tweetWrapper' key={i}>
        <div className='twitProfilePic'><img src={twit.profile_image_url} alt="profile pic"></img></div>
        <div className='twitHeader'><h3>{twit.user}</h3></div>
        <div className='twitFollowers'><p>{twit.followers_count}</p></div>
        <div className='twitContent'><p>{twit.userTweet}</p></div>
        <div className='twitInfo'>
          <p>LINKS:</p>
          <DisplayUrls links={twit.urls} />
          <p>#:</p>
          <DisplayList data={twit.hashtags} />
        </div>
      </div>
    )
  )
}

export default displayTweet;