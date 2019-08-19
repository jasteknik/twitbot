import React from 'react';
import Button from './Button'
import apiService from './../Services/ApiService'

const displayDatabases = (props) => {
  //console.log("props" + props.data)
  const buttonEvent = (e, file) => {
    //HOX, event is carried to this function to prevent default click when page is created
    e.preventDefault()
    //console.log('button pressed ')
    const params = {
      filename: file
    }
    
    const response = apiService.ChangeData('/loadDatabase', params)
    response.then(response => {
      console.log(response)

    })

  }
  return (
    props.data.map((file, key) => <Button key={key} onClick={(e) => buttonEvent(e, file)} text={file}></Button>
    )
  )
}

export default displayDatabases;