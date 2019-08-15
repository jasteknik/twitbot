const bot = require('./botmodule')
const File = require('./file')
const Datastore = require('nedb')

let keywordArray = undefined
let currentKeyword = undefined
let lastTimeRowCount = 0
let currentTrend = 0
const cutOffPoint = 0.1
const TweetTimeout = 30 * 1000

const database = new Datastore( './Responses/trends.db'); //new neDB datastore
database.loadDatabase(); 

const params2 = {
  id: '2357024', //1 is global, 23424812, finland, 23424975 UK, 2357024 US
  //count: 1
}


//Main server routine!
async function Routine() {
  console.log("starting server")
  await FetchTopTrending()
  console.log("Top trends fetched")
  
  //Read top trends from json
  keywordArray = await File.ReadFromFile('trends')
  console.log("File read response, total keywords found: " + keywordArray.length)

  //StreamFromDB()
  StreamFromFile() //Start stream, initial start at first keyword
  setInterval(() => CheckTweetCount(keywordArray[currentTrend - 1]), TweetTimeout)
}

function StreamFromFile() {
  console.log("Streaming...")
  bot.TweetSreaming(keywordArray[currentTrend].name)
  //Ternary operation, comparator ? if true : if false
  currentTrend = (currentTrend < keywordArray.length - 1) ? currentTrend += 1 : 0
  
}

function StreamFromDB() {
  console.log("Streaming from trends.DB")
  
  KeywordFromDatabase(currentTrend)
    .then(keyword => bot.TweetSreaming(keyword))
  
  
  //TOP 5 from DB
  currentTrend = (currentTrend < 5) ? currentTrend += 1 : 0
}

function InterruptStreaming() {
  console.log("InterruptStreaming()")
  bot.StopStreaming()
  setTimeout(() => StreamFromFile(), 1000) //delay to stop streaming
  lastTimeRowCount = 0
}

//Check tweet counts
//Calculate current trends popularity by how many tweets got added to tweet.DB
//Continue to next trend when limit is done
function CheckTweetCount(aKeyword) {
  let count = bot.GetRowCount() //Get rows from twitter bot module
  let newTweetsThisUpdate = count - lastTimeRowCount
  
  //console.log("CheckTweetCount(aKeyword): " + aKeyword.name)
  //calculate popularity on current trend
  aKeyword.popularity = CalculatePopularity(
    newTweetsThisUpdate, 
    TweetTimeout,
    aKeyword.popularity)
  
  console.log("old time is " + aKeyword.timeStamp)
  //update timestamp
  aKeyword.timeStamp = + new Date()
  
  console.log("new time is " + aKeyword.timeStamp)
  TrendDatabase(aKeyword).then(response => {
    if(response === "OK"){
      console.log("count: " + count + " last: " + lastTimeRowCount)
      console.log("popularity: " + aKeyword.popularity)

      if (aKeyword.popularity > cutOffPoint)
        lastTimeRowCount = count //update last time count
      
      //Tweet count too low. Start streaming new keyword from trending list 
      else InterruptStreaming()
      //Tweets at 100, continue to next trending topic
      if (count > 99 
          && aKeyword.popularity < 0.75
          || count > 250) //Always cuts when streaming goes to this point
        InterruptStreaming()
    }
    else
      console.log(response) //error
  })
}

//Update on trends database as promise
function TrendDatabase(entry) {
  return new Promise((resolve, reject) => {
    console.log("Database func called with: " + entry.name)
    database.find({ name: entry.name}, (err, docs) => {
      if(docs == '') { //No entry found, add new
        console.log("insert on DB")
        database.insert(entry)
        resolve("OK")
      }
      else { //Found current keyword on DB
        console.log(`found from trends database: ${docs[0].name} with id: ${docs[0]._id}`)
        console.log("Update on DB")
        database.update({ _id: docs[0]._id }, {
          name: entry.name, 
          popularity: entry.popularity, 
          timeStamp: entry.timeStamp
        }, {}, (err, numReplaced) => {
          if (err) reject('Error on updating entry on trends.db: ' + err)
          else console.log('Update made on items ' + numReplaced )
        })
        resolve("OK")
      }
      if (err) reject('Error on finding entry on trends.db: ' + err)
    })
  })
}

//Ask bot to write top trending tags to json file 
function FetchTopTrending() {
  return new Promise((resolve, reject) => {
    console.log("fetching trends...")
    resolve(bot.TopTrending(params2))
  })
}

function KeywordFromDatabase(nextValue) {
  return new Promise((resolve, reject) => {
    //Sort database by popularity, pick next keyword
    database.find({}) 
      .sort({ popularity: -1 })
      .exec((err, docs) => {
        // docs is [doc1, doc3, doc2]
        query = docs[nextValue]
        if (err) reject('Error on sorting datatable')
        resolve(query.name)
    })
  }) //Return new promise
}

//Function to calculate trends popularity
function CalculatePopularity(thisUpdate, timePeriod, lastPop) {
  const tps = thisUpdate / (timePeriod / 1000)  //tweets per second
  const avrg = (lastPop + tps) / 2  //calculate average tweet based on last update
  return avrg
}

Routine()