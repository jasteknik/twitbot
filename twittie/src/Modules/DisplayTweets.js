import React from 'react'
import DisplayUrls from './DisplayUrls'
import DisplayList from './DisplayList'

const displayTweet = (props) => {
  console.log("props objekti")
  console.log(props.data)
  const AFI = false
  //Check case for return
  if(props.data.length !== 0){
    
    props.data.map((twit, i) => {
      
      if(twit.hashtags.length > 0 && twit.urls.length === 0 && AFI) {
        console.log("hjello 1")
        return(
          <div className='tweetWrapper' key={i}>
            <div className='twitProfilePic'><img src={twit.profile_image_url} alt="profile pic"></img></div>
            <div className='twitHeader'><h3>{twit.user}</h3></div>
            <div className='twitFollowers'><p>{twit.followers_count}</p></div>
            <div className='twitContent'><p>{twit.userTweet}</p></div>
            <div className='twitInfo'>
              <p>#:</p>
              <ul><DisplayList data={twit.hashtags} /></ul>      
            </div>
          </div>
        )
      }
      if(twit.hashtags.length === 0 && twit.urls.length > 0  && AFI) {
        console.log("hjello 2")
        return(
          <div className='tweetWrapper' key={i}>
            <div className='twitProfilePic'><img src={twit.profile_image_url} alt="profile pic"></img></div>
            <div className='twitHeader'><h3>{twit.user}</h3></div>
            <div className='twitFollowers'><p>{twit.followers_count}</p></div>
            <div className='twitContent'><p>{twit.userTweet}</p></div>
            <div className='twitInfo'>
              <p>LINKS:</p>
              <DisplayUrls links={twit.urls} />
            </div>
          </div>
        )
      }
      if(twit.hashtags.length === 0 && twit.urls.length === 0  && AFI) {
        console.log("hjello 3")
        return (
          <div className='tweetWrapper' key={i}>
            <div className='twitProfilePic'><img src={twit.profile_image_url} alt="profile pic"></img></div>
            <div className='twitHeader'><h3>{twit.user}</h3></div>
            <div className='twitFollowers'><p>{twit.followers_count}</p></div>
            <div className='twitContent'><p>{twit.userTweet}</p></div>
            <div className='twitInfo'></div>
          </div>
        )
      }
      else {
        console.log("hjello 4")
        return(
          <div className='tweetWrapper' key={i}>
            <div className='twitProfilePic'><img src={twit.profile_image_url} alt="profile pic"></img></div>
            <div className='twitHeader'><h3>{twit.user}</h3></div>
            <div className='twitFollowers'><p>{twit.followers_count}</p></div>
            <div className='twitContent'><p>{twit.userTweet}</p></div>
            <div className='twitInfo'>
              <p>LINKS:</p>
              <DisplayUrls links={twit.urls} />
              <p>#:</p>
              <ul><DisplayList data={twit.hashtags} /></ul>
            </div>
          </div>
        )
      }
    })  
  }

  else return (
    <div className='tweetWrapper' key='0'>
      <div className='twitProfilePic'></div>
      <div className='twitHeader'><h3>NO CONTENT</h3></div>
      <div className='twitFollowers'><p>#</p></div>
      <div className='twitContent'><p>NO CONTENT</p></div>
      <div className='twitInfo'></div>
    </div>
  ) 
}

export default displayTweet;