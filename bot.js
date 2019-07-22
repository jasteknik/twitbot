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

const tweetObj = {
  user: null,
  tweet: null,
  hashtags: [],
  urls: []
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
  id: '23424975', //1 is global, 23424812, finland, 23424975 UK
  //count: 1
}

//topTrending(params2)
//setInterval(() => topTrending(params2), 1000*60)
//getTweets(params)
//AvailableTrends()

console.log(`streaming keyword ${argKeyword}, with location ${argLocation} and follower count ${argFollowers}` )
//Start streaming keyword to file
let stream = T.stream('statuses/filter', { track: argKeyword })
stream.on('tweet', (tweet) => { 
  
  if (argLocation != '')


  //console.log(txtToFile)
  if (tweet.user.followers_count > argFollowers    
    && ( argLocation === 'noLoc' 
    ||  (argLocation != 'noLoc' 
      && tweet.user.location != null
      && tweet.user.location.toUpperCase() === argLocation.toUpperCase())))
    {  //Only above follower limit and with or without location
    const txtToFile = tweet.text + "\n" + "     FROM @" + tweet.user.name + "\n" + "\n"
    tweetObj.user = tweet.user.name
    tweetObj.tweet = tweet.text

    if (tweet.entities.hashtags.length > 0) { //Push hashtags to object array
      tweetObj.hashtags = []  //empty array
      for (let i = 0; i < tweet.entities.hashtags.length; i++ ){
        tweetObj.hashtags.push(tweet.entities.hashtags[i].text)
      } 
    }

    if (tweet.entities.urls.length > 0) { //Push urls to object array
      //console.log(tweet.entities.hashtags.length)
      tweetObj.urls = []  //empty array
      for (let i = 0; i < tweet.entities.urls.length; i++ ){
        tweetObj.urls.push(tweet.entities.urls[i].url)
        //console.log("pushing" + tweet.entities.hashtags[i].text)
      }
    }
    //if (tweet.entities.urls.length > 0) tweetObj.urls = tweet.entities.urls[0].url

    database.insert(tweetObj)

    //console.log(tweetObj)

    File.WriteToJson("streamKeyword", tweet) //write last to json file
    //File.WriteToText("streamTweets_" + argKeyword, txtToFile, streamAppend)  //Append streamTweets.json file
    //streamAppend = true //after first write, start appending file
  }
})
















function getTweets(aPar) {
  T.get('statuses/user_timeline', aPar, tweetData) //813286 barack obama

  function tweetData(err, data, response){
    console.log(data[0].text)
    WriteJsonToFile("tweet", data)
  }
}


function AvailableTrends() {
  T.get('trends/available', null , gotTrendsAvailable)
  function gotTrendsAvailable(err, data, response){
    //console.log(data)
    WriteJsonToFile("available", data)
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
        WriteJsonToFile("trends", trends)
      }
      catch(err) {
        console.log("ERROR on trending data collection: " + err)
      }
  }
}