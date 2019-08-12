let bot = require('./botmodule')
let File = require('./file')

let keywordArray = undefined
let lastTimeRowCount = 0
let currentTrend = 0
const cutOffPoint = 0.1
const TweetTimeout = 30 * 1000

const trendsObject = {
  name: '',
  popularity: 0
}


const params2 = {
  id: '23424975', //1 is global, 23424812, finland, 23424975 UK, 2357024 US
  //count: 1
}



async function Routine() {
  console.log("starting server")
  await FetchTopTrending()
  console.log("Top trends fetched")
  
  keywordArray = await File.ReadFromFile('trends')
  console.log("File read response, total keywords found: " + keywordArray.length)

  StartStream() //Start stream, initial start at first keyword
  console.log("Routine(), after Stream start " )
  setInterval(() => CheckTweetCount(), TweetTimeout)
}

function FetchTopTrending() {
  return new Promise((resolve, reject) => {
    console.log("fetching trends...")
    resolve(bot.TopTrending(params2))
  })
}

function StartStream() {

  console.log("Streaming...")
  bot.TweetSreaming(keywordArray[currentTrend].name)
  //Ternary operation, comparator ? if true : if false
  currentTrend = (currentTrend < keywordArray.length - 1) ? currentTrend += 1 : 0
}

function CheckTweetCount() {
  let count = bot.GetRowCount() //Get rows from twitter bot module
  let newTweetsThisUpdate = count - lastTimeRowCount

  //calculate popularity on current trend
  keywordArray[currentTrend].popularity = CalculatePopularity(
    newTweetsThisUpdate, 
    TweetTimeout, 
    keywordArray[currentTrend].popularity)

  console.log("count: " + count + " last: " + lastTimeRowCount)
  console.log("popularity: " + keywordArray[currentTrend].popularity)

  if (keywordArray[currentTrend].popularity > cutOffPoint)
    lastTimeRowCount = count //update last time count
  
  //Tweet count too low. Start streaming new keyword from trending list 
  else InterruptStreaming()
  //Tweets at 100, continue to next trending topic
  if (count > 49 
      && keywordArray[currentTrend].popularity < 0.75
      || count > 150)
    InterruptStreaming()
  
}

function CalculatePopularity(thisUpdate, timePeriod, lastPop) {
  const tps = thisUpdate / (timePeriod / 1000)  //tweets per second
  const avrg = (lastPop + tps) / 2  //calculate average tweet based on last update
  return avrg
}


function InterruptStreaming() {
  console.log("InterruptStreaming()")
  bot.StopStreaming()
  setTimeout(() => StartStream(), 1000) //delay to stop streaming
  lastTimeRowCount = 0
}

Routine()