import React from 'react';

const displayList = (props) => {
  return(
    props.data.map((line, i) => 
      <li key={i}>{line}</li>)
  )
}

export default displayList;