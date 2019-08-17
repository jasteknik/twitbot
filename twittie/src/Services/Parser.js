const Datastore = require('nedb')
const glob = require('glob')
let db
let dbName
let TopTweets = []
let query = {};

async function AsynCall() {
  console.log('Loading DB')
  let loadResult = await LoadDatabase()
  console.log('load result: ' + loadResult)
  let result = await DataStorageHandler()
    .catch((err) => console.log(err))
  console.log("From user: " + result.user)
  console.log("User original tweet: " + result.userTweet)
  console.log("retweet to: " + result.reTweet)
}

//This function sorts database based on count value, max up
//Filter result with argument
//
function DataStorageHandler(filteredUser) {
  return new Promise((resolve, reject) => {
    db.find({ $not: { user: filteredUser }}) //$not: { user: filteredUser }
    .sort({ count: -1 })
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

function LoadDatabase() {
  return new Promise((resolve, reject) => {
    glob("*.db", {}, function (er, files) {
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

AsynCall()

export default {}