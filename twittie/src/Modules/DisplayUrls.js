import React from 'react';

const displayUrls = (props) => {
  return(
    props.links.map((line, i) => <React.Fragment>
      <a key={i} href={line}>--> link {i + 1} &#60;--</a><br></br>  
      </React.Fragment>)
  ) //&#60; is Ascii code for character <
}

export default displayUrls;