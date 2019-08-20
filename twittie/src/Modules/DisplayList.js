import React from 'react';

const displayList = (props) => {
  return(
    props.data.map(line => 
      <li>{line}</li>)
  )
}

export default displayList;