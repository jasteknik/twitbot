import React from 'react';
import DisplayList from './DisplayList'
import DisplayUrls from './DisplayUrls'

//Choose tweet layout. 
//4 layouts
//Hashtags, No urls
//No Hashtags, Urls
//Neither
//Both

const displayTweetBasic = (props) => {
  //console.log(props.data)
  if(props.data.hashtags.length > 0 && props.data.urls.length === 0) {
    return (
      <React.Fragment>
        <div className='twitProfilePic'><img src={props.data.profile_image_url} alt="profile pic"></img></div>
        <div className='twitHeader'><h3>{props.data.user}</h3></div>
        <div className='twitFollowers'><p>{props.data.followers_count}</p></div>
        <div className='twitContent'><p>{props.data.userTweet}</p></div>
        <div className='twitInfo'>
          <p>#:</p>
          <ul><DisplayList data={props.data.hashtags} /></ul>  
        </div>
      </React.Fragment>
    )
  }
  if(props.data.hashtags.length === 0 && props.data.urls.length > 0) {
    return (
      <React.Fragment>
        <div className='twitProfilePic'><img src={props.data.profile_image_url} alt="profile pic"></img></div>
        <div className='twitHeader'><h3>{props.data.user}</h3></div>
        <div className='twitFollowers'><p>{props.data.followers_count}</p></div>
        <div className='twitContent'><p>{props.data.userTweet}</p></div>
        <div className='twitInfo'>
          <p>LINKS:</p>
          <DisplayUrls links={props.data.urls} />
        </div>
      </React.Fragment>
    )
  }
  if(props.data.hashtags.length === 0 && props.data.urls.length === 0) {
    return (
      <React.Fragment>
        <div className='twitProfilePic'><img src={props.data.profile_image_url} alt="profile pic"></img></div>
        <div className='twitHeader'><h3>{props.data.user}</h3></div>
        <div className='twitFollowers'><p>{props.data.followers_count}</p></div>
        <div className='twitContent'><p>{props.data.userTweet}</p></div>
      </React.Fragment>
    )
  }
  else {
    return (
      <React.Fragment>
        <div className='twitProfilePic'><img src={props.data.profile_image_url} alt="profile pic"></img></div>
        <div className='twitHeader'><h3>{props.data.user}</h3></div>
        <div className='twitFollowers'><p>{props.data.followers_count}</p></div>
        <div className='twitContent'><p>{props.data.userTweet}</p></div>
        <div className='twitInfo'>
          <p>#:</p>
          <ul><DisplayList data={props.data.hashtags} /></ul>  
          <p>LINKS:</p>
        </div>
      </React.Fragment>
    )  
  }
}

export default displayTweetBasic;