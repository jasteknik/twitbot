import React from 'react';
import Button from './Button'
import ApiService from './../Services/ApiService'

const displayDatabases = (props) => {
  //console.log("props" + props.data)
  const buttonEvent = () => {
    console.log('button pressed ')
    const data = {
      filename: 'testFile.db'
    }
    const config = {
      headers: {'Accept': 'application/json'}
    }
    const response = ApiService.ChangeData('/loadDatabase', data, config)
    response.then(response => console.log(response))

  }
  return (
    //props.data.map((file, key) => <p key={key}>{file}</p>
    props.data.map((file, key) => <Button key={key} onClick={buttonEvent} text={file}></Button>
    )
  )
}

export default displayDatabases;