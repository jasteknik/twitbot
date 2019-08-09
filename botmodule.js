let Twit = require('twit')
const woeid = require('woeid')
const config = require('./config')
const File = require('./file')
const Datastore = require('nedb')
let T = new Twit( config )
let rowCount = 0

let argKeyword = 'mango'
let argLocation = 'noLoc'
let argFollowers = 0
let streamAppend = false
let streamStopped = false
let StreamCounter = 0
let stream

const tweetObj = {
  user: null,
  tweet: null,
  quote_count: 0,
  reply_count: 0,
  retweet_count: 0,
  hashtags: [],
  urls: [],
  count: 0
}

const database = new Datastore('database.db'); //new neDB datastore
database.loadDatabase();

function topTrending(aPar){
  T.get('trends/place', aPar, gotData);

  function gotData(err, data, response) {
      try {
        const responseFromApi = data[0].trends
        const trends = []

        Object.keys(responseFromApi).map((key, index) =>  {
          trends.push(responseFromApi[key].name)
        });
        console.log("Starting to file write")
        //write to file
        File.WriteToJsonSync("trends", trends).then(() => {
          console.log("WriteToJsonSync, promise filled")
          argKeyword = trends[StreamCounter]
          argFollowers = 10
          StreamCounter += 1
        })
        
      }
      catch(err) {
        console.log("ERROR on trending data collection: " + err)
      }
  }
}

//Start streaming keyword to file
function TweetSreaming(keyword){
  rowCount = 0
  stream = T.stream('statuses/filter', { track: keyword }) 
  console.log(`streaming keyword ${keyword}, with location ${argLocation} and follower count ${argFollowers}` )
  
  stream.on('tweet', (tweet) => { 
    File.WriteToJson("streamKeyword", tweet) //write last to json file
    if (argLocation != '')
    //console.log(txtToFile)
    if (tweet.user.followers_count > argFollowers    
      && ( argLocation === 'noLoc' 
      ||  (argLocation != 'noLoc' 
        && tweet.user.location != null
        && tweet.user.location.toUpperCase() === argLocation.toUpperCase())))
      {  //Only above follower limit and with or without location

        //File.WriteToJson("streamKeyword", tweet) //write last to json file
        if(tweet.hasOwnProperty("retweeted_status")){ //Only if tweet is a retweet to someone elses tweet
          WriteTweetObject(tweet)
          //Insert new tweetObj to database
          database.insert(tweetObj)
          rowCount += 1
          //console.log(rowCount)
          NewTweetTimeStamp = + new Date() //unix time   
      }
    }
  })
}

function WriteTweetObject(tweetJson) {
  //Copy tweet information to object

  tweetObj.user = tweetJson.retweeted_status.user.name
  tweetObj.tweet = tweetJson.retweeted_status.text
  tweetObj.quote_count = tweetJson.retweeted_status.quote_count
  tweetObj.reply_count = tweetJson.retweeted_status.reply_count
  tweetObj.retweet_count = tweetJson.retweeted_status.retweet_count
  
  if (tweetJson.hasOwnProperty("extended_tweet")){
    const fullText = tweetJson.extended_tweet  //check for full text (extented tweet)
    if (fullText.hasOwnProperty("full_text")) tweetObj.tweet = fullText.full_text
  }

  //Are there more tweets from this user? Add counter by 1
  database.count({
    user: tweetObj.user }, (err, count) => {
      if(err) console.log('error on fetching docs: ' + err)
      //add tweet counter
      tweetObj.count = count + 1 
    }) 

    /*
  if (tweetJson.retweeted_status.extended_tweet.entities.hashtags.length > 0) { //Push hashtags to object array
    tweetObj.hashtags = []  //empty array
    for (let i = 0; i < tweetJson.retweeted_status.extended_tweet.entities.hashtags.length; i++ ){
      tweetObj.hashtags.push(tweetJson.retweeted_status.extended_tweet.entities.hashtags[i].text)
    } 
  }

  if (tweetJson.retweeted_status.extended_tweet.entities.urls.length > 0) { //Push urls to object array
    tweetObj.urls = []  //empty array
    for (let i = 0; i < tweetJson.retweeted_status.extended_tweet.entities.urls.length; i++ ){
      tweetObj.urls.push(tweetJson.retweeted_status.extended_tweet.entities.urls[i].url)
    }
  }*/
}

function StopStreaming() {
  console.log("stream stop called")
  stream.stop()
}

function GetRowCount() { return rowCount}

module.exports = {
  topTrending: topTrending,
  TweetSreaming: TweetSreaming,
  StopStreaming: StopStreaming,
  GetRowCount: GetRowCount
}