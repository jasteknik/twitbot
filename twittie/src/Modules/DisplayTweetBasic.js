import React from 'react';

const displayTweetBasic = (props) => {
  return(
    
      <React.Fragment>
        <div className='twitProfilePic'><img src={props.data.profile_image_url} alt="profile pic"></img></div>
        <div className='twitHeader'><h3>{props.data.user}</h3></div>
        <div className='twitFollowers'><p>{props.data.followers_count}</p></div>
        <div className='twitContent'><p>{props.data.userTweet}</p></div>
      </React.Fragment>
    
  )
}

export default displayTweetBasic;