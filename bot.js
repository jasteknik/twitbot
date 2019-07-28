let Twit = require('twit')
const woeid = require('woeid')
const config = require('./config')
const File = require('./file')
const Datastore = require('nedb')
let T = new Twit( config )

let argKeyword = 'mango'
let argLocation = 'noLoc'
let argFollowers = 0
let streamAppend = false
let streamStopped = false
let StreamCounter = 0

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

//Arguments from command line
if (process.argv[2] != null) argKeyword = process.argv[2] //Keyword
if (process.argv[3] != null) argLocation = process.argv[3] //Location
if (process.argv[4] != null) argFollowers = process.argv[4] //Followers

//console.log(woeid.getWoeid('FIN'))
const params = {
  id: '813286', //1 is global, 23424812, finland
  count: 1
}
const params2 = {
  id: '2357024', //1 is global, 23424812, finland, 23424975 UK, 2357024 US
  //count: 1
}

//AvailableTrends()

topTrending(params2)

//Start streaming keyword to file
function TweetSreaming(){
  let rowCount = 0
  let stream = T.stream('statuses/filter', { track: argKeyword })
  console.log(`streaming keyword ${argKeyword}, with location ${argLocation} and follower count ${argFollowers}` )
  
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

          console.log(rowCount)

        
      }
    }

    if (rowCount > 100){ 
      console.log("stop stream")
      stream.stop()
      streamStopped = true
      topTrending(params2)
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


function getTweets(aPar) {
  T.get('statuses/user_timeline', aPar, tweetData) //813286 barack obama

  function tweetData(err, data, response){
    console.log(data[0].text)
    File.WriteToJson("tweet", data)
  }
}


function AvailableTrends() {
  T.get('trends/available', null , gotTrendsAvailable)
  function gotTrendsAvailable(err, data, response){
    //console.log(data)
    File.WriteToJson("available", data)
  }

}

function topTrending(aPar){
  T.get('trends/place', aPar, gotData);

  function gotData(err, data, response) {
      //var tweets = data;
      //console.log(JSON.stringify(tweets, undefined, 2));
      //console.log("data: "+data)
      try {
        const responseFromApi = data[0].trends
        const trends = []

      //console.log(responseFromApi[0])

        Object.keys(responseFromApi).map((key, index) =>  {
          trends.push(responseFromApi[key].name)
        });

        //#1
        //console.log(trends[0])

        //write to file
        File.WriteToJson("trends", trends)
        console.log(trends[0]) 
        argKeyword = trends[StreamCounter]
        argFollowers = 10
        StreamCounter += 1
        TweetSreaming()  //Start streaming trending keyword
      }
      catch(err) {
        console.log("ERROR on trending data collection: " + err)
      }
  }
}