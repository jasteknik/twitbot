const cors = require ('cors')
const express = require('express')
const app = express()
const Datastore = require('nedb')
const glob = require('glob')
const File = require('./file')

let db
let dbName
let TopTweets = []
let query = {};

//Cors, Server needs to have cors rights to be able to serv
//http and get request from two different sources. Web safety system
app.use(cors())
//Simple server page
app.get('/', (req, res) => {
  res.send('<h1>Twittie server</h1>')
})

//Client get requests, /api
app.get('/api', (req, res) => {
  FindAllTweets().then(data => {
    res.json(data)
    console.log("Request from user")
  }) 
})

//Client get requests, /api
app.get('/getDatabases', (req, res) => {
  FindAllDatabases().then(data => {
    res.json(data)
    console.log("Request from user, databases")
  }) 
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


//This function sorts database based on count value, max up
//Filter result with argument
//
function FindTopTweet(filteredUser) {
  return new Promise((resolve, reject) => {
    db.find({ $not: { user: filteredUser }}) //$not: { user: filteredUser }
    .sort({ number: -1 })
    .exec((err, docs) => {
      // docs is [doc1, doc3, doc2]
      TopTweets.push(docs[0])
      query = TopTweets[0]
      //console.log("Query dot username: " + query.user)
      if (err) reject('Error on sorting datatable')

      resolve(query)

    })
  }) //Return new promise
}

function FindAllTweets() {
  return new Promise((resolve, reject) => {
    db.find({}) //$not: { user: filteredUser }
      .exec((err, docs) => {
        // docs is [doc1, doc3, doc2]
        query = docs
        //console.log("Query dot username: " + query.user)
        if (err) reject('Error on sorting datatable')

        resolve(query)
    })
  }) //Return new promise
}

function FindAllDatabases() {
  return new Promise((resolve, reject) => {
    File.ListFolder('./Databases/').then(response => {
      //console.log("Files in folder " + response)
      resolve(response)})
  })
}

//Server start routine. Handles loading database. 
//
async function ServerStartRoutine() {
  console.log('Loading DB')
  const loadResult = await LoadDatabase()
  console.log(`DB ${loadResult} loaded. Ready for data requests`)
}

//LoadDatabase function
//Returns promise. Posts database name when ready
function LoadDatabase() {
  return new Promise((resolve, reject) => {
    glob("./TwittieDB/*.db", {}, function (er, files) {
      // files is an array of filenames.
      // If the `nonull` option is set, and nothing
      // was found, then files is ["**/*.js"]
      // er is an error object or null.
      dbName = files[0]
      db = new Datastore({ filename: './' + dbName })
      db.loadDatabase((err) => {    // Callback is optional
        if (err) reject("error at loading database, errorcode: " + err)
        else resolve(dbName)
      })
      if (er) reject('Cant find DB files on directory: ' + er)
    })
  })
}

//Start call
ServerStartRoutine()
