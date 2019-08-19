let Twit = require('twit')
const woeid = require('woeid')
const config = require('./../config')
const File = require('./file')
const Datastore = require('nedb')
const AddUrl = require('./urlify')

let T = new Twit( config )
let rowCount = 0

let argKeyword = 'mango'
let argLocation = 'noLoc'
let argFollowers = 0
let streamAppend = false
let streamStopped = false
let StreamCounter = 0
let stream
let currentKeyword = ''

const tweetObj = {  //Tweet object
  user: null,
  userTweet: null,
  followers_count: 0,
  friends_count: 0,
  reTweetedUser: null,
  reTweetedScreen_name: null,
  reTweet: null,
  reTweet_quote_count: 0,
  reTweet_reply_count: 0,
  retweet_count: 0,
  profile_image_url: '',
  number: 0
}

function NewTrendsObject(aName, aPopularity, aTime) {
  return {
    name: aName,
    popularity: aPopularity,
    timeStamp: aTime
  }
}

function TopTrending(aPar) {
  return new Promise((resolve, reject) => {
    
    const gotData = (err, data, response) => {
      try {
        const responseFromApi = data[0].trends
        const trends = []        
        let newTrendsObject

        Object.keys(responseFromApi).map((key, index) =>  {
          //New object needs to created. Because if trends object is changed and then pushed to array
          //whole array will change to that new object. Because pushed object to array is just a reference!!!
          newTrendsObject = NewTrendsObject(
            responseFromApi[key].name,
            0,
            new Date())
            
          trends.push(newTrendsObject)
        });

        //write to file
        console.log("Starting to file write")
        File.WriteToJsonSync("trends", trends)
          .then(() => {
            console.log("WriteToJsonSync, promise filled")
            argKeyword = trends[StreamCounter]
            argFollowers = 10
            StreamCounter += 1
            resolve()
          })
          //.catch(reject())
          //Cant make this work... Need reject statement to handle errors
      }
      catch(err) {
        console.log("ERROR on trending data collection: " + err)
      }
    }

    T.get('trends/place', aPar, gotData);
  })
}

//Start streaming keyword to file
function TweetSreaming(keyword){
  const database = new Datastore( './Databases/' + keyword + '.db'); //new neDB datastore
  database.loadDatabase(); 
  rowCount = 0
  currentKeyword = keyword
  stream = T.stream('statuses/filter', { track: keyword }) 
  console.log(`streaming keyword ${keyword}, with location ${argLocation} and follower count ${argFollowers}` )
  
  stream.on('tweet', (tweet) => { 
    File.WriteToJson("streamKeyword", tweet) //write last to json file
    if (argLocation != '')
      if (tweet.user.followers_count > argFollowers    
        && ( argLocation === 'noLoc' 
        ||  (argLocation != 'noLoc' 
          && tweet.user.location != null
          && tweet.user.location.toUpperCase() === argLocation.toUpperCase())))
        {  //Only above follower limit and with or without location

          //File.WriteToJson("streamKeyword", tweet) //write last to json file
          if(tweet.hasOwnProperty("retweeted_status")){ //Only if tweet is a retweet to someone elses tweet
            WriteTweetObject(tweet, database)
            //Insert new tweetObj to database
            database.insert(tweetObj)
            rowCount += 1
            NewTweetTimeStamp = + new Date() //unix time   
        }
      }
  })
}

function WriteTweetObject(tweetJson, dbRef) {
  //Copy tweet information to object

  tweetObj.user = tweetJson.retweeted_status.user.name
  tweetObj.userTweet = tweetJson.text //AddUrl.urlify(tweetJson.text)  //Check user tweet for URL, make a html link
  tweetObj.followers_count = tweetJson.user.followers_count
  tweetObj.friends_count = tweetJson.friends_count
  tweetObj.reTweetedUser = tweetJson.retweeted_status.user.name
  tweetObj.reTweetedScreen_name = tweetJson.retweeted_status.user.screen_name
  tweetObj.reTweet = tweetJson.retweeted_status.text
  tweetObj.quote_count = tweetJson.retweeted_status.quote_count
  tweetObj.reply_count = tweetJson.retweeted_status.reply_count
  tweetObj.retweet_count = tweetJson.retweeted_status.retweet_count
  tweetObj.profile_image_url = tweetJson.user.profile_image_url
  
  if (tweetJson.hasOwnProperty("extended_tweet")){
    const fullText = tweetJson.extended_tweet  //check for full text (extented tweet)
    if (fullText.hasOwnProperty("full_text")) tweetObj.reTweet = fullText.full_text
  }

  //Are there more tweets from this user? Add counter by 1
  dbRef.count({
    user: tweetObj.user }, (err, number) => {
      if(err) console.log('error on fetching docs: ' + err)
      //add tweet counter
      tweetObj.number = number + 1 
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

function GetCurrentKeyword() {return currentKeyword}

module.exports = {
  TopTrending: TopTrending,
  TweetSreaming: TweetSreaming,
  StopStreaming: StopStreaming,
  GetRowCount: GetRowCount,
  GetCurrentKeyword: GetCurrentKeyword
}