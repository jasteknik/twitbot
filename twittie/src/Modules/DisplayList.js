import React from 'react';

const displayList = (props) => {
  return(
    props.data.map(line => 
      <ul>{line}</ul>)
  )
}

export default displayList;