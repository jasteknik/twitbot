let bot = require('./botmodule')
let File = require('./file')

let keywordArray = undefined
let lastTimeRowCount = 0
let i = 0
const TweetInterval = 5
const TweetTimeout = 30 * 1000

const params2 = {
  id: '23424975', //1 is global, 23424812, finland, 23424975 UK, 2357024 US
  //count: 1
}



async function Routine() {
  console.log("starting server")
  await FetchTopTrending()
  console.log("Top trends fetched")
  keywordArray = await File.ReadFromFile('trends')
  console.log("File read response: " + keywordArray[0])
  StartStream() //Start stream, initial start at first keyword
  console.log("Routine(), after Stream start " )
  setInterval(() => CheckTweetCount(), TweetTimeout)
}

function FetchTopTrending() {
  return new Promise((resolve, reject) => {
    console.log("fetching trends...")
    resolve(bot.topTrending(params2)  )
  })
}

  
function StartStream() {

  console.log("Streaming...")
  bot.TweetSreaming(keywordArray[i])
  i += 1

}

function CheckTweetCount() {
  let count = bot.GetRowCount() //Get rows from twitter bot module
  let newTweetsThisUpdate = count - lastTimeRowCount
  console.log("count: " + count + " last: " + lastTimeRowCount)
  if (newTweetsThisUpdate > TweetInterval)
    lastTimeRowCount = count //update last time count
  
  //Tweet count too low. Start streaming new keyword from trending list 
  else InterruptStreaming()
  //Tweets at 100, continue to next trending topic
  if (count > 99) InterruptStreaming()
  

}

function InterruptStreaming() {
  console.log("InterruptStreaming()")
  bot.StopStreaming()
  setTimeout(() => StartStream(), 1000) //delay to stop streaming
  lastTimeRowCount = 0
}

Routine()