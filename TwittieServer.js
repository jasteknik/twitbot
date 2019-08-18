const cors = require ('cors')
const express = require('express')
const app = express()
const Datastore = require('nedb')
const File = require('./Modules/file')

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
  FindAllDatabases('./TwittieDB/').then(data => {
    res.json(data)
    console.log("Request from user, databases")
  }) 
})

//Client requests new database
app.post('/loadDatabase', (req, res) => {
  console.log(req)
  res.json({ok: 'ok'})
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
        query = docs
        if (err) reject('Error on sorting datatable')
        resolve(query)
    })
  }) //Return new promise
}

//Server start routine. Handles loading database. 
//
async function ServerStartRoutine() {

  console.log('copying DB files from Dataserver...')
  
  const dataserverList = await FindAllDatabases('./Databases/')
  const copy = await CopyAll(dataserverList)
  
  const wait1 = await WaitUntil(1000, "Copying of server files done")
  console.log(wait1)

  console.log('Finding DB files on ./TwittieDB/')
  const dbList = await FindAllDatabases('./TwittieDB/')

  const wait2 = await WaitUntil(1000, "Gathered DB files")
  console.log(wait2)

  console.log(`Loading database ${dbList[0]} `)
  const loadResult = await LoadDatabase(dbList[0])

  const wait3 = await WaitUntil(1000, `DB ${loadResult} loaded. Ready for data requests`)
  console.log(wait3)
  
}

function FindAllDatabases(path) {
  return new Promise((resolve, reject) => {
    File.ListFolder(path).then(response => {
      //console.log("Files in folder " + response)
      resolve(response)})
  })
}

//LoadDatabase function
//Returns promise. Posts database name when ready
function LoadDatabase(file) {
  return new Promise((resolve, reject) => {
    db = new Datastore({ filename: './' + file })
    db.loadDatabase((err) => {    // Callback is optional
      if (err) reject("error at loading database, errorcode: " + err)
      else resolve(file)
    })
  })
} 

function CopyAll(source) {
  return new Promise((resolve, reject) => {
    source.forEach(file => {
      File.CopyFile( './Databases/' + file, './TwittieDB/' + file)
        .then(resp => {
          console.log(resp)
          resolve('OK')
        })
    }) 
  }) 
}

function WaitUntil(time, routine) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(routine), time)
  })
}

//Start call
ServerStartRoutine()
