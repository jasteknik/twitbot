//Imports
const bot = require('./botmodule')
const File = require('./file')
const Datastore = require('nedb')
const colors = require('colors')

let keywordArray = undefined
let currentKeyword = undefined
let currentTrend = 0
let tweetCount = 0
let lastTimeRowCount = 0
let init = true
let counter = 0

let timeout = 30 * 1000
const cutOffPoint = 0.1

//new neDB datastore
const database = new Datastore( './Responses/trends.db'); 
database.loadDatabase(); 

//Stream parameters
const params2 = {
  id: '23424975', //1 is global, 23424812, finland, 23424975 UK, 2357024 US
  //count: 1
}

//Main routine start
MainRoutine()

async function MainRoutine() {
  //Server initialization, create trends.json and load it to array
  console.log("starting server".green)
  await FetchTopTrending()
  console.log("Top trends fetched")
  keywordArray = await File.ReadFromFile('trends')
  console.log("File read response, total keywords found: " + keywordArray.length)
  //Init DONE! Start Stream service from Bot
  console.log("Stream service starting...")
  bot.TweetSreaming(keywordArray[currentTrend].name)
  console.log("Starting init data gathering!")
  
  do{ //THIS IS INITIAL DATA GATHERING LOOP
    console.log("Gathering tweets of " + keywordArray[currentTrend].name)
    //This subroutine causes a delay. So data can be gathered
    const sub2 = await SubRoutine2("Check tweet count")
    console.log(sub2)
    keywordArray[currentTrend] = await CheckTweetCount(keywordArray[currentTrend])
    console.log("Done! " + keywordArray[currentTrend].name)
    const update = await UpdateDatabase(keywordArray[currentTrend])
    console.log(update)
    const limits = await CheckLimits(keywordArray[currentTrend], tweetCount)
    console.log(limits)
    init = await InitDataNotDone()

  } while (init)

  const wait1 = await WaitUntil(1000, "Initial data gathering is done".green)
  console.log(wait1)
  //Refresh database, gets rid of dublicate ids. This is caused by update function on neDB
  database.loadDatabase()
  const wait2 = await WaitUntil(1000, "Refreshing DB")
  console.log(wait2)
  const wait3 = await WaitUntil(1000, "DB refreshed".green)
  console.log(wait3)
  //Start streaming from trends.db
  StreamFromDB()
 
  do{ //THIS IS MAIN TRENDS STREAMING LOOP
    console.log("Streaming on current popular trends".green)
    const sub2 = await SubRoutine2("Check tweet count")
    console.log(sub2)
    currentKeyword = await CheckTweetCount(currentKeyword)
    console.log("Done! " + currentKeyword.name)
    const update = await UpdateDatabase(currentKeyword)
    console.log(update)
    const limits = await CheckLimits(currentKeyword, tweetCount)
    console.log(limits)

  } while (true)

  console.log("Exiting software!")
}

function StreamFromDB() {
  console.log("Streaming from trends.DB".yellow)  
  KeywordFromDatabase(currentTrend)
    .then(keyword => {
      bot.TweetSreaming(keyword.name)
      currentKeyword = keyword
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
        resolve(query)
    })
  }) //Return new promise
}

function CheckTweetCount(aKeyword) {
  return new Promise((resolve, reject) => {
    tweetCount = bot.GetRowCount() //Get rows from twitter bot module
    const newTweetsThisUpdate = tweetCount - lastTimeRowCount
    
    //calculate popularity on current trend
    aKeyword.popularity = CalculatePopularity(
      newTweetsThisUpdate, 
      timeout,
      aKeyword.popularity)
    
    //update timestamp
    aKeyword.timeStamp = + new Date()

    resolve(aKeyword)
  })
}

function UpdateDatabase(entry) {
  return new Promise((resolve, reject) => {
    console.log(`Database func called with: ${entry.name} and popularity ${entry.popularity}`)
    database.find({ name: entry.name}, (err, docs) => {
      if(docs == '') { //No entry found, add new
        console.log("insert on DB")
        database.insert(entry)
        resolve("Database insert OK".yellow)
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
        resolve("Database update OK".green)
      }
      if (err) reject('Error on finding entry on trends.db: ' + err)
    })
  })
}

function CheckLimits(aKeyword, aCount) {
  return new Promise((resolve, reject) => {
    console.log("count: " + aCount + " last: " + lastTimeRowCount)
    console.log("popularity: " + aKeyword.popularity)
    
    if (aKeyword.popularity > cutOffPoint) lastTimeRowCount = aCount //update last time count   
    else { //Tweet count too low. Start streaming new keyword from trending list 
      InterruptStreaming()
      resolve("Stream below cutoff point, continue to next stream".red)
    }
    //Tweets at 100, continue to next trending topic
    if (aCount > 99 && aKeyword.popularity < 0.75 || aCount > 250) { //Always cuts when streaming goes to this point
      InterruptStreaming()
      resolve(`${aKeyword.name} trend info gathered. Continue to next trend...`.green)
    }

    resolve("Limits OK, continuing...")
  })
}

function InitDataNotDone() {
  return new Promise((resolve, reject) => {
    if(currentTrend < 5){      //keywordArray.length
      resolve(true)
    }
    else {
      //Continue out of while loop, reset currentTrend
      currentTrend = 0
      resolve(false)
    }
  })
}

function SubRoutine2(infoText) {
  return new Promise((resolve, reject) => {
    console.log("Starting SubRoutine2()")
    resolve(WaitUntil(timeout, infoText))
  })
}

//Ask bot to write top trending tags to json file 
function FetchTopTrending() {
  return new Promise((resolve, reject) => {
    console.log("fetching trends...")
    resolve(bot.TopTrending(params2))
  })
}

//Interrupt current stream and start a new
function InterruptStreaming() {
  console.log("InterruptStreaming()")
  bot.StopStreaming()
  currentTrend += 1
  if(init) 
    setTimeout(() => bot.TweetSreaming(keywordArray[currentTrend].name), 1000) //delay to stop streaming
  else {
    if (currentTrend > 4) currentTrend = 0  //When streaming DB, only stream top five trends in DB
    KeywordFromDatabase(currentTrend)
      .then(keyword => {
        bot.TweetSreaming(keyword.name)
        currentKeyword = keyword
      })
  }
  
  lastTimeRowCount = 0
}

//Function to calculate trends popularity
function CalculatePopularity(thisUpdate, timePeriod, lastPop) {
  const tps = thisUpdate / (timePeriod / 1000)  //tweets per second
  const avrg = (lastPop + tps) / 2  //calculate average tweet based on last update
  return avrg
}

function WaitUntil(time, routine) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(routine), time)
  })
}