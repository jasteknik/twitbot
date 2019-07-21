var Twit = require('twit')
const woeid = require('woeid')
const config = require('./config')
var T = new Twit( config )


//console.log(woeid.getWoeid('FIN'))
const params = {
  id: '813286', //1 is global, 23424812, finland
  count: 1
}
const params2 = {
  id: '23424975', //1 is global, 23424812, finland, 23424975 UK
  //count: 1
}

const keyword = 'oulu'

//topTrending(params2)
//setInterval(() => topTrending(params2), 1000*60)

//getTweets(params)

//AvailableTrends()
console.log("streaming keyword "  + keyword)
var stream = T.stream('statuses/filter', { track: keyword })

stream.on('tweet', function (tweet) {
  //console.log(tweet)
  writeToFile("streamKeyword", tweet)
})

function getTweets(aPar) {
  T.get('statuses/user_timeline', aPar, tweetData) //813286 barack obama

  function tweetData(err, data, response){
    console.log(data[0].text)
    writeToFile("tweet",data)
  }
}

function writeToFile(fileName ,toFile) {
  const fs = require('fs')
  const file = "./responses/" + fileName +  ".json"
  const json = JSON.stringify(toFile, null, 2)
    fs.writeFile(file, json,
      (error) => {
        if (error) console.log("Error on writing file: ", error)
        else console.log("Writing file " + file)
        })
}

function AvailableTrends() {
  T.get('trends/available', null , gotTrendsAvailable)
  function gotTrendsAvailable(err, data, response){
    //console.log(data)
    writeToFile("available", data)
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
        writeToFile("trends", trends)
      }
      catch(err) {
        console.log("ERROR on trending data collection: " + err)
      }
  }
}